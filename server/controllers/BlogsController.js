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
    return res.status(404).json({ status: 'error', message: 'Blog not found' });
  }

  if (!Array.isArray(users)) {
    return res.status(400).json({ status: 'error', message: 'Expected a list of users' });
  }

  if (users.length > 2 || blog.invitedUsers > 2 || users.length + blog.invitedUsers.length > 2) {
    return res.status(400).json({ status: 'error', message: 'invited user cannot exceed 2' });
  }

  const usersPromise = [];
  try { // convert userId to ObjecId
    for (let i = 0; i < users.length; i++) {
      users[i] = new ObjectId(users[i]);
      usersPromise.push(dbClient.findData('users', { _id: users[i] }));
    }
  } catch (err) {
    return res.status(400).json({ status: 'error', message: 'incorrect id' });
  }

  try {
    const result = await Promise.all(usersPromise);
    if (result.length !== users.length) {
      return res.status(404).json({ status: 'error', message: 'Some users does not exist' });
    }

    // Update Blog invited users
    await dbClient.updateData(
      'blogs',
      { _id: new ObjectId(blog._id) },
      { $addToSet: { invitedUsers: { $each: users } } },
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
