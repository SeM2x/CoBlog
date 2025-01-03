import dbClient from '../utils/db';
import generateId from '../utils/uuid';

const { ObjectId } = require('mongodb');

export async function createBlog(req, res) {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ status: 'error', message: 'Blog title is missing' });
  }

  const data = {
    title,
    authorId: new ObjectId(req.user.userId),
    authorEmail: req.user.userEmail,
    authorUsername: req.user.username,
    roomId: generateId(),
    conversationId: generateId(),
    invitedUsers: [],
    CoAuthors: [],
    status: 'draft',
    isPublished: false,
  };

  try {
    const result = await dbClient.insertData('blogs', data);
    const {
      authorEmail, _id, invitedUsers, CoAuthors, updatedAt, ...resp
    } = data;
    resp.blogId = result.insertedId;
    return res.status(200).json({ status: 'success', data: resp });
  } catch (err) {
    return res.status(500).json({ status: 'error', Message: 'Something went wrong' });
  }
}

export async function suggestTopics(req, res) {
  try {
    const result = await dbClient.findManyData('topics', {});
    return res.status(200).json({ status: 'success', data: result });
  } catch (err) {
    return res.status(500).json({ status: 'error', Message: 'Something went wrong' });
  }
}

export async function getUserBlogs(req, res) {
  const userId = new ObjectId(req.user.userId);
  let { cursor, limit } = req.query;
  limit = limit ? (limit + 0) / 10 : 10;

  if (cursor === 'null') {
    return res.status(200).json({ status: 'success', message: 'No more data to fetch', data: [] });
  }

  const pipeline = [
    { $match: { authorId: userId, createdAt: { $lt: cursor || new Date().toISOString() } } },
    { $sort: { createdAt: -1 } },
    { $limit: limit + 1 }, // Include one more data for page info
  ];

  try {
    const result = await dbClient.findManyData('blogs', pipeline, true);
    const pageInfo = {
      cursor: result[limit] ? result[limit - 1].createdAt : null,
      hasNext: !!result[limit],
    };

    return res.status(200).json({
      status: 'success',
      data: pageInfo.hasNext ? result.slice(0, -1) : result,
      pageInfo,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: 'error', message: 'something went wrong' });
  }
}

export async function inviteUsers(req, res) {
  let { blogId } = req.params;
  const { users } = req.body;

  try {
    blogId = new ObjectId(blogId);
  } catch (err) {
    return res.status(400).json({ status: 'error', message: 'incorret blog id' });
  }

  const blog = await dbClient.findData('blogs', { _id: blogId, authorId: new ObjectId(req.user.userId) });
  if (!blog) {
    return res.status(404).json({ status: 'error', message: 'Blog not found for this user' });
  }

  if (!Array.isArray(users) || typeof users[0] !== 'object') {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid input format. Expected an array of user objects.',
    });
  }

  if (users.length > 3 || blog.invitedUsers > 3 || users.length + blog.invitedUsers.length > 3) {
    return res.status(400).json({
      status: 'error',
      message: 'invited user cannot exceed 3',
    });
  }

  const usersPromise = [];
  try { // convert userId to ObjecId
    for (let i = 0; i < users.length; i++) {
      users[i].id = new ObjectId(users[i].id);
      usersPromise.push(dbClient.findData('users', { _id: users[i].id }));
    }
  } catch (err) {
    return res.status(400).json({ status: 'error', message: 'incorrect id' });
  }

  try {
    const result = await Promise.all(usersPromise);
    if (result.length !== users.length) {
      return res.status(404).json({ status: 'error', message: 'Some users does not exist' });
    }

    const invitedUsersData = result.map((user, index) => ({
      id: user._id,
      username: user.username,
      profileUrl: user.profileUrl,
      role: users[index].role || 'editor', // using result idx to get user role
      acknowledged: false,
    }));

    // Update Blog invited users
    await dbClient.updateData(
      'blogs',
      { _id: new ObjectId(blog._id) },
      { $addToSet: { invitedUsers: { $each: invitedUsersData } } },
    );

    // Create notification for invited users
    const userNotificationsPromise = result.map((user) => dbClient.insertData('notifications', {
      userId: user._id,
      blogId: blog._id,
      type: 'invite',
      message: `${blog.authorUsername} invites you to co-write a blog: ${blog.title}`,
      read: false,
    }));
    await Promise.all(userNotificationsPromise);

    return res.status(200).json({ status: 'success', message: 'User invited successfully' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: 'error', message: 'something went wrong' });
  }
}

export async function publishBlog(req, res) {
  let { blogId } = req.params;
  try {
    blogId = new ObjectId(blogId);
  } catch (err) {
    return res.status(400).json({ status: 'error', message: 'Incorrect id' });
  }

  const {
    topics, subTopics, imagesUrl, minuteRead, content,
  } = req.body;
  if (!topics && !subTopics) {
    return res.status(400).json({ status: 'error', message: 'topics or subtopics must be included' });
  }

  if (!content) {
    return res.status(400).json({ status: 'error', message: 'Missing blog content' });
  }

  const details = {
    topics,
    subTopics,
    minutesRead: minuteRead || Math.floor(Math.random() * 10),
    nComments: 0,
    nShares: 0,
    nLikes: 0,
    content,
    imagesUrl,
    isPublished: true,
    status: 'published',
  };

  const result = await dbClient.updateData('blogs', { _id: blogId }, { $set: details });
  if (result.matchedCount === 0) {
    return res.status(404).json({ status: 'error', message: 'Blog not found' });
  }

  return res.status(200).json({ status: 'success', message: 'Blog is published' });
}

export async function getBlogById(req, res) {
  let { blogId } = req.params;
  try {
    blogId = new ObjectId(blogId);
  } catch (err) {
    return res.status(400).json({ status: 'error', message: 'Incorrect Id' });
  }

  const blog = await dbClient.findData('blogs', { _id: blogId });
  if (!blog) {
    return res.status(404).json({ status: 'error', message: 'Blog not found' });
  }

  // Remove invited users from blog
  const { invitedUsers, ...data } = blog;
  return res.status(200).json({ status: 'success', data });
}

export async function manageInvitation(req, res) {
  let { blogId } = req.body;
  try {
    blogId = new ObjectId(blogId);
  } catch (err) {
    return res.status(400).json({ status: 'error', message: 'Incorrect Id' });
  }

  const blog = await dbClient.findData('blogs', { _id: blogId });
  if (!blog) {
    return res.status(404).json({ status: 'error', message: 'Blog not found' });
  }

  if (blog.isPublished) {
    return res.status(400).json({ status: 'error', message: 'Blog is already published' });
  }

  let user = null;
  for (const invitedUser of blog.invitedUsers) {
    if (ObjectId(req.user.userId).equals(invitedUser.id)) {
      user = invitedUser;
      break;
    }
  }

  if (!user) {
    return res.status(404).json({ status: 'error', message: 'User invitation was not found' });
  }

  // Check if user already acknowledge invitation
  if (user.acknowledged === true) {
    return res.status(409).json({ status: 'error', message: 'response was previously made already' });
  }

  try {
    const { acknowledged, ...userData } = user;

    const url = req.url.toLowerCase().slice(1);
    if (url === 'accept') {
      await dbClient.updateData('blogs', { _id: blogId }, { $addToSet: { CoAuthors: userData } });
    }

    // Update user ack status
    await dbClient.updateData(
      'blogs',
      { _id: blogId, 'invitedUsers.id': user.id },
      { $set: { 'invitedUsers.$.acknowledged': true } },
    );

    // Create notification for the inviter on the invited user resp
    const notificationData = {
      userId: new ObjectId(blog.authorId),
      type: 'invite-response',
      message: `${req.user.username} ${url}ed your invite to co-write ${blog.title}`,
      read: false,
      blogId,
    };
    await dbClient.insertData('notifications', notificationData);

    return res.status(200).json({ status: 'success', message: `Invite successfully ${url}ed` });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Something went wrong' });
  }
}
