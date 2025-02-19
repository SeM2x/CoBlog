/* eslint-disable prefer-const */
/* eslint-disable no-plusplus */

import dbClient from '../utils/db';
import generateId from '../utils/uuid';
import redisClient from '../utils/redis';
import { broadcastNotification, broadcastPublishedBlog } from '../socket';

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
    authorProfileUrl: req.user.userProfileUrl,
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
    return res.status(500).json({ status: 'error', Message: 'Something went wrong', data: { inviteCount: 0 } });
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

  cursor = cursor ? new Date(cursor) : new Date();
  const match = { authorId: userId, createdAt: { $lt: cursor } };
  const { published } = req.query;
  if (published === 'false') {
    match.isPublished = false;
  }

  const pipeline = [
    { $match: match },
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
    return res.status(500).json({ status: 'error', message: 'Something went wrong' });
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

  if ((users.length + blog.invitedUsers.length) > 3 || blog.invitedUsers.length === 3) {
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
    if (!result.every((value) => value)) {
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
    const appendInvitedUser = await dbClient.updateData(
      'blogs',
      { _id: new ObjectId(blog._id) },
      { $addToSet: { invitedUsers: { $each: invitedUsersData } } },
      false,
    );
    if (appendInvitedUser.modifiedCount === 0) {
      return res.status(200).json({ status: 'success', message: 'Invitation previously sent' });
    }

    // Create notification for invited users
    const userNotificationsPromise = invitedUsersData.map((user) => dbClient.insertData('notifications', {
      userId: user.id,
      role: user.role,
      blog: { id: blog._id, title: blog.title },
      type: 'invite',
      author: {
        id: blog.authorId,
        username: blog.authorUsername,
        profileUrl: blog.authorProfileUrl,
      },
      message: `${blog.authorUsername} invites you to co-write a blog: ${blog.title}`,
      status: 'pending',
      read: false,
    }));
    await Promise.all(userNotificationsPromise);

    // broadcast notification
    const instantNotificationData = { users, message: `${blog.authorUsername} invites you to co-write a blog: ${blog.title}` };
    broadcastNotification(instantNotificationData);

    return res.status(200).json({
      status: 'success',
      message: 'User invited successfully',
      data: { inviteCount: blog.invitedUsers.length + users.length },
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Something went wrong' });
  }
}

export async function publishBlog(req, res) {
  let { blogId } = req.params;
  try {
    blogId = new ObjectId(blogId);
  } catch (err) {
    return res.status(400).json({ status: 'error', message: 'Incorrect id' });
  }

  const blog = await dbClient.findData('blogs', { _id: blogId });
  if (!blog) {
    return res.status(404).json({ status: 'error', message: 'Blog does not exist for this user' });
  }

  if (!(ObjectId(req.user.userId).equals(blog.authorId))) {
    return res.status(400).json({ status: 'error', message: 'Only author can publish blog' });
  }

  if (blog.isPublished) {
    return res.status(400).json({ statusu: 'error', message: 'Blog has previously been published' });
  }

  const {
    topics, subTopics, imagesUrl, minuteRead, content, title,
  } = req.body;
  if (!topics && !subTopics) {
    return res.status(400).json({ status: 'error', message: 'topics or subtopics must be included' });
  }

  if (!content) {
    return res.status(400).json({ status: 'error', message: 'Missing blog content' });
  }

  const details = {
    topics,
    title,
    subTopics,
    minutesRead: minuteRead || Math.floor(Math.random() * (12 - 4 + 1)) + 4,
    nComments: 0,
    nShares: 0,
    nReactions: 0,
    content,
    imagesUrl,
    isPublished: true,
    status: 'published',
  };

  try {
    await dbClient.updateData('blogs', { _id: blogId }, { $set: details });
    await dbClient.insertData('reactions', { blogId, reactions: [] });

    if (blog.CoAuthors.length > 0) {
      const users = blog.CoAuthors.map((user) => ({
        id: user.id,
      }));

      const instantNotificationData = {
        blogId,
        users,
      };

      broadcastPublishedBlog(instantNotificationData);
    }

    return res.status(200).json({ status: 'success', message: 'Blog is published' });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Something went wrong' });
  }
}

export async function getBlogById(req, res) {
  let { blogId } = req.params;
  let { userId } = req.user;

  try {
    blogId = new ObjectId(blogId);
    userId = new ObjectId(userId);
  } catch (err) {
    return res.status(400).json({ status: 'error', message: 'Incorrect Id' });
  }

  const blog = await dbClient.findData('blogs', { _id: blogId });
  if (!blog) {
    return res.status(404).json({ status: 'error', message: 'Blog not found' });
  }

  let access = userId.equals(blog.authorId);
  if (!blog.isPublished && !access) {
    let coauthorId;
    for (const coauthor of blog.CoAuthors) {
      coauthorId = new ObjectId(coauthor.id);
      if (coauthorId.equals(userId)) {
        access = true;
        break;
      }
    }
  }

  if (!blog.isPublished && !access) {
    return res.status(404).json({ status: 'error', message: 'You cannot view this blog' });
  }

  if (!userId.equals(blog.authorId)) {
    delete blog.invitedUsers;
  }

  if (blog.isPublished) {
    delete blog.roomId;
    delete blog.conversationId;
  }

  return res.status(200).json({ status: 'success', data: blog });
}

export async function manageInvitation(req, res) {
  let { blogId, notificationId } = req.body;
  let { userId } = req.user;

  if (!blogId || !notificationId) {
    return res.status(400).json({ status: 'error', message: 'Notification or Blog id missing' });
  }
  try {
    blogId = new ObjectId(blogId);
    userId = new ObjectId(userId);
    notificationId = new ObjectId(notificationId);
  } catch (err) {
    return res.status(400).json({ status: 'error', message: 'Incorrect notification or blog Id' });
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
    if (userId.equals(invitedUser.id)) {
      user = invitedUser;
      break;
    }
  }

  if (!user) {
    return res.status(404).json({ status: 'error', message: 'User invitation is not found' });
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
      await dbClient.insertData('coauthored', { userId, blogId });
    }

    // Update user ack status
    await dbClient.updateData(
      'blogs',
      { _id: blogId, 'invitedUsers.id': user.id },
      { $set: { 'invitedUsers.$.acknowledged': true } },
    );

    // Create notification for the inviter on the invited user resp
    const notificationData = {
      userId: blog.authorId,
      type: 'invite-response',
      message: `${req.user.username} ${url}ed your invite to co-write ${blog.title}`,
      read: false,
      blogId,
    };
    await dbClient.insertData('notifications', notificationData);

    await dbClient.updateData(
      'notifications',
      { _id: notificationId },
      { $set: { status: `${url}ed` } },
    );

    // broadcast notification
    const instantNotificationData = {
      users: [notificationData.userId.toString()],
      message: notificationData.message,
    };
    broadcastNotification(instantNotificationData);

    return res.status(200).json({ status: 'success', message: `Invite successfully ${url}ed` });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Something went wrong' });
  }
}

export async function deleteBlog(req, res) {
  let { blogId } = req.params;
  try {
    blogId = new ObjectId(blogId);
  } catch (err) {
    return res.status(400).json({ status: 'error', message: 'Incorrect Id' });
  }

  const blog = await dbClient.deleteData('blogs', { _id: blogId, authorId: new ObjectId(req.user.userId) });
  if (blog.deletedCount === 0) {
    return res.status(404).json({ status: 'error', message: 'Blog not found for this user' });
  }
  return res.status(200).json({ status: 'success', message: 'Blog successfully deleted' });
}

export async function updateBlogReaction(req, res) {
  let { blogId } = req.params;
  let { userId } = req.user;
  try {
    blogId = new ObjectId(blogId);
    userId = new ObjectId(userId);
  } catch (err) {
    return res.status(400).json({ status: 'error', message: 'Incorrect Id' });
  }

  try {
    const blog = await dbClient.findData('blogs', { _id: blogId });
    if (!blog) {
      return res.status(404).json({ status: 'error', message: 'Blog does not exist' });
    }

    if (!blog.isPublished) {
      return res.status(400).json({ status: 'error', message: 'Blog is yet to be published' });
    }

    const result = await dbClient.updateData('reactions', { blogId }, { $addToSet: { reactions: userId } });
    // unreact if user already reacted
    if (result.modifiedCount === 0) {
      await dbClient.updateData('reactions', { blogId }, { $pull: { reactions: userId } });
      await dbClient.updateData('blogs', { _id: blogId }, { $inc: { nReactions: -1 } });
      return res.status(200).json({
        status: 'success',
        message: 'Reaction successfully updated.',
        data: { userReaction: 'unlike', nReactions: blog.nReactions - 1 },
      });
    }
    await dbClient.updateData('blogs', { _id: blogId }, { $inc: { nReactions: 1 } });
    return res.status(200).json({
      status: 'success',
      message: 'Reaction successfully updated.',
      data: { userReaction: 'like', nReactions: blog.nReactions + 1 },
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Something went wrong' });
  }
}

export async function saveBlogCurrentStatus(req, res) {
  let { blogId } = req.params;
  let { userId } = req.user;

  try {
    blogId = new ObjectId(blogId);
    userId = new ObjectId(userId);
  } catch (err) {
    return res.status(400).json({ status: 'error', message: 'Incorrect id' });
  }

  const blog = await dbClient.findData('blogs', { _id: blogId });
  if (!blog) {
    return res.status(404).json({ status: 'error', message: 'Blog does not exist for this user' });
  }


  if (!(userId.equals(blog.authorId))) {
    return res.status(404).json({ status: 'error', message: 'You dont have permission to update blog' });
  }

  const {
    topics, subTopics, imagesUrl, content, title,
  } = req.body;

  if (!topics) {
    return res.status(400).json({ status: 'error', message: 'topics cannot be empty' });
  }

  const details = {
    topics,
    subTopics,
    content,
    imagesUrl,
    title,
  };

  try {
    await dbClient.updateData('blogs', { _id: blogId }, { $set: details });
    return res.status(200).json({ status: 'success', message: 'Blog is published' });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Something went wrong' });
  }
}

export async function blogComment(req, res) {
  let { blogId } = req.params;
  let { content } = req.body;

  try {
    blogId = new ObjectId(blogId);
  } catch (err) {
    return res.status(400).json({ status: 'error', message: 'Incorrect id' });
  }

  if (!content) {
    return res.status(400).json({ status: 'error', message: 'content is missing' });
  }

  const blog = await dbClient.findData('blogs', { _id: blogId });
  if (!blogId) {
    return res.status(404).json({ status: 'error', message: 'Blog does not exist' });
  }

  if (!blog.isPublished) {
    return res.status(400).json({ status: 'error', message: 'Blog is yet to be published' });
  }

  const details = {
    blogId,
    userId: new ObjectId(req.user.userId),
    username: req.user.username,
    content,
  };

  try {
    await dbClient.insertData('comments', details);
    const { _id, ...data } = details;
    data.id = _id.toString();

    return res.status(200).json({
      status: 'success',
      message: 'comment created',
      data,
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Something went wrong' });
  }
}

export async function getBlogComments(req, res) {
  let { blogId } = req.params;
  try {
    blogId = new ObjectId(blogId);
  } catch (err) {
    return res.status(400).json({ status: 'error', message: 'Incorrect id' });
  }

  const blog = await dbClient.findData('blogs', { _id: blogId });
  if (!blog) {
    return res.status(404).json({ status: 'error', message: 'Blog does not exist' });
  }

  if (!blog.isPublished) {
    return res.status(400).json({ status: 'error', message: 'Blog is yet to be published' });
  }

  try {
    const result = await dbClient.findManyData('comments', { blogId });
    return res.status(200).json({ status: 'success', data: result });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Something went wrong' });
  }
}

export async function getInvitationHistory(req, res) {
  let { cursor, limit } = req.query;
  if (cursor === 'null') {
    return res.status(200).json({ status: 'success', message: 'No more data to fetch', data: [] });
  }

  limit = limit ? (limit + 0) / 10 : 10;
  cursor = cursor ? (cursor + 0) / 10 : 0;

  const details = { userId: new ObjectId(req.user.userId), type: 'invite' };
  try {
    const result = await dbClient.findManyData('notifications', details);

    const endIdx = cursor + limit;
    const paginatedNotifications = result.slice(cursor, endIdx);
    const pageInfo = {
      cursor: result[endIdx] ? endIdx : null,
      hasNext: !!result[endIdx],
    };

    return res.status(200).json(
      { status: 'success', data: paginatedNotifications, pageInfo },
    );
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Something went wrong' });
  }
}

export async function getUserFeed(req, res) {
  let { userId } = req.user;
  userId = new ObjectId(userId);

  let { limit, cursor } = req.query;
  if (cursor === 'null') {
    return res.status(200).json({
      status: 'success',
      data: [],
      message: 'No more data to fetch',
      pageInfo: { cursor: null, hasNext: false },
    });
  }
  limit = limit ? (limit + 0) / 10 : 10;
  cursor = cursor ? (cursor + 0) / 10 : 0;

  let cachedBlog = await redisClient.get(`Blog_${req.user.userId}`);
  let hasNext;

  if (!cachedBlog || !cachedBlog[cursor]) {
    let userViewHistory = await dbClient.findData('viewshistory', { userId });
    let blogHistory;
    if (userViewHistory) {
      blogHistory = userViewHistory.blogHistory;
      if (!blogHistory) {
        blogHistory = [generateId()]; // Generate random id for blog exclusion
      }
    } else {
      blogHistory = [generateId()];
    }

    const pipeline = [
      { $match: { _id: { $nin: blogHistory }, isPublished: true } },
      { $limit: 51 }, // Query extra data for hasNext
    ];

    let result = await dbClient.findManyData('blogs', pipeline, true);
    if (!result) {
      return res.status(200).json({
        status: 'success',
        data: [],
        message: 'No more data to fetch',
        pageInfo: { cursor: null, hasNext: false },
      });
    }
    hasNext = !!result[50]; // Tracks db hasNext
    result = JSON.stringify(result);
    await redisClient.set(`Blog_${req.user.userId}`, result, 900); // cache feed for 15 min
    cursor = 0; // reset cursor
    cachedBlog = result;
  }

  // Paginate feed
  const endIdx = cursor + limit;
  let feeds = JSON.parse(cachedBlog);

  const pageInfo = {
    cursor: (feeds[endIdx] || hasNext) ? endIdx : null,
    hasNext: !!(feeds[endIdx] || hasNext), // Computes hasNext for redis && db
  };

  feeds = feeds.slice(cursor, endIdx);

  // Filter blogs
  const postId = [];
  const filteredPost = feeds.map((feed) => {
    postId.push(new ObjectId(feed._id));
    const result = {
      id: feed._id,
      title: feed.title,
      content: feed.content,
      author: {
        id: feed.authorId,
        username: feed.authorUsername,
        profileUrl: feed.authorProfileUrl,
      },
      CoAuthors: feed.CoAuthors,
      status: feed.status,
      topics: feed.topics,
      subTopics: feed.subTopics,
      minutesRead: feed.minutesRead,
      nComments: feed.nComments,
      nLikes: feed.nLikes,
      nShares: feed.nShares,
      nReactions: feed.nReactions,
      imagesUrl: feed.imagesUrl,
      createdAt: feed.createdAt,
      updatedAt: feed.updatedAt,
    };

    return result;
  });
  dbClient.updateData('viewshistory', { userId }, { $addToSet: { blogHistory: { $each: postId } } }); // Mark user view blog
  return res.status(200).json({ status: 'success', data: filteredPost, pageInfo });
}

export async function getCoAuthoredHistory(req, res) {
  let { userId } = req.user;
  try {
    userId = new ObjectId(userId);
  } catch (err) {
    return res.status(400).json({ status: 'error', message: 'Incorrect id' });
  }

  let { cursor, limit } = req.query;
  if (cursor === 'null') {
    return res.status(200).json({ status: 'success', message: 'No more data to fetch', data: [] });
  }

  limit = limit ? (limit + 0) / 10 : 10;
  cursor = cursor ? new Date(cursor) : new Date();
  const pipeline = [
    { $match: { userId, createdAt: { $lt: cursor } } },
    { $sort: { createdAt: -1 } },
    { $limit: limit + 1 }, // One more data for page pagination info
  ];

  try {
    const sharedBlogs = await dbClient.findManyData('coauthored', pipeline, true);

    const pageInfo = {
      cursor: sharedBlogs[limit] ? sharedBlogs[limit - 1].createdAt : null,
      hasNext: !!sharedBlogs[limit],
    };

    if (sharedBlogs.length === 0) {
      return res.status(200).json({
        status: 'success',
        data: [],
        message: 'User has no shared blogs',
        pageInfo,
      });
    }

    const data = [];
    // Find each blogs with thier id
    const blogPromise = sharedBlogs.map((blog) => dbClient.findData('blogs', { _id: blog.blogId }));
    const results = await Promise.all(blogPromise);
    for (const result of results) {
      if (result) { // If blog is not null (deleted)
        delete result.invitedUsers;
        data.push(result);
      }
    }

    return res.status(200).json({ status: 'success', data, pageInfo });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Something went wrong' });
  }
}

export async function checkReactionStatus(req, res) {
  let { blogId } = req.params;
  try {
    blogId = new ObjectId(blogId);
  } catch (err) {
    return res.status(400).json({ status: 'error', message: 'Incorrect id' });
  }

  try {
    const blog = await dbClient.findData('reactions', { blogId });
    if (!blog) {
      return res.status(404).json({ status: 'error', message: 'Blog not found' });
    }

    const { userId } = req.user;

    let isLike = blog.reactions.some((user) => user.equals(userId));
    return res.status(200).json({
      status: 'success',
      data: { isLike, isBookmark: false },
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', mesage: 'Something went wrong' });
  }
}

export async function getOtherUsersBlogs(req, res) {
  let { userId } = req.params;

  try {
    userId = new ObjectId(userId);
  } catch (err) {
    return res.status(400).json({ status: 'error', message: 'Incorrect id' });
  }

  let { cursor, limit } = req.query;
  limit = limit ? (limit + 0) / 10 : 10;

  if (cursor === 'null') {
    return res.status(200).json({ status: 'success', message: 'No more data to fetch', data: [] });
  }

  cursor = cursor ? new Date(cursor) : new Date();
  const pipeline = [
    { $match: { authorId: userId, isPublished: true, createdAt: { $lt: cursor } } },
    { $sort: { createdAt: -1 } },
    { $limit: limit + 1 }, // Include one more data for page info
  ];

  try {
    const result = await dbClient.findManyData('blogs', pipeline, true);
    const pageInfo = {
      cursor: result[limit] ? result[limit - 1].createdAt : null,
      hasNext: !!result[limit],
    };

    const blogs = result.map((blog) => ({
      id: blog._id,
      title: blog.title,
      content: blog.content,
      author: {
        id: blog.authorId,
        username: blog.authorUsername,
        profileUrl: blog.authorProfileUrl,
      },
      CoAuthors: blog.CoAuthors,
      status: blog.status,
      topics: blog.topics,
      subTopics: blog.subTopics,
      minutesRead: blog.minutesRead,
      nComments: blog.nComments,
      nLikes: blog.nLikes,
      nShares: blog.nShares,
      nReactions: blog.nReactions,
      imagesUrl: blog.imagesUrl,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
    }));

    return res.status(200).json({
      status: 'success',
      data: pageInfo.hasNext ? blogs.slice(0, -1) : blogs,
      pageInfo,
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Something went wrong' });
  }
}

export async function userViewHistory(req, res) {
  let { userId } = req.user;
  userId = new ObjectId(userId);

  let { cursor, limit } = req.query;
  limit = limit ? (limit + 0) / 10 : 10;
  cursor = cursor ? (cursor + 0) / 10 : 0;

  try {
    const result = await dbClient.findData('viewshistory', { userId });
    if (!result) {
      return res.status(404).json({ status: 'error', message: 'User does not exist' });
    }

    // Paginate resp
    const endIdx = cursor + limit;
    const paginatedBlogs = result.blogHistory.slice(cursor, endIdx);
    const pageInfo = {
      cursor: result.blogHistory[endIdx] ? endIdx : null,
      hasNext: !!result.blogHistory[endIdx],
    };

    if (!paginatedBlogs[0]) {
      return res.status(200).json({ status: 'success', data: [], pageInfo });
    }

    const viewsHistoryPromise = paginatedBlogs.map((blogId) => dbClient.findData('blogs', { _id: blogId }));
    Promise.all(viewsHistoryPromise)
      .then((results) => {
        const resp = results.map((blog) => ({
          id: blog._id,
          title: blog.title,
          content: blog.content,
          author: {
            id: blog.authorId,
            username: blog.authorUsername,
            profileUrl: blog.authorProfileUrl,
          },
          CoAuthors: blog.CoAuthors,
          status: blog.status,
          topics: blog.topics,
          subTopics: blog.subTopics,
          minutesRead: blog.minutesRead,
          nComments: blog.nComments,
          nLikes: blog.nLikes,
          nShares: blog.nShares,
          nReactions: blog.nReactions,
          imagesUrl: blog.imagesUrl,
          createdAt: blog.createdAt,
          updatedAt: blog.updatedAt,
        }));
        return res.status(200).json({ status: 'success', data: resp, pageInfo });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({ status: 'error', message: 'something went wrong' });
      });
  } catch (err) {
    return res.status(500).json({ status: 'success', message: 'Something went wrong' });
  }
}

export async function getOtherCoBlogs(req, res) {
  let { userId } = req.params;
  try {
    userId = new ObjectId(userId);
  } catch (err) {
    return res.status(400).json({ status: 'error', message: 'Incorrect id' });
  }

  const pipeline = [
    { $match: { userId } },
    { $sort: { createdAt: -1 } },
  ];

  try {
    const sharedBlogs = await dbClient.findManyData('coauthored', pipeline, true);

    if (sharedBlogs.length === 0) {
      return res.status(200).json({
        status: 'success',
        data: [],
        message: 'User has no shared blogs',
      });
    }

    const data = [];
    // Find each blogs with thier id
    const blogPromise = sharedBlogs.map((blog) => dbClient.findData('blogs', { _id: blog.blogId }));
    const blogs = await Promise.all(blogPromise);
    for (const blog of blogs) {
      if (blog && blog.isPublished) { // If blog is not null (deleted) and is published
        let result = {
          id: blog._id,
          title: blog.title,
          content: blog.content,
          author: {
            id: blog.authorId,
            username: blog.authorUsername,
            profileUrl: blog.authorProfileUrl,
          },
          CoAuthors: blog.CoAuthors,
          status: blog.status,
          topics: blog.topics,
          subTopics: blog.subTopics,
          minutesRead: blog.minutesRead,
          nComments: blog.nComments,
          nLikes: blog.nLikes,
          nShares: blog.nShares,
          nReactions: blog.nReactions,
          imagesUrl: blog.imagesUrl,
          createdAt: blog.createdAt,
          updatedAt: blog.updatedAt,
        };
        data.push(result);
      }
    }
    return res.status(200).json({ status: 'success', data });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Something went wrong' });
  }
}
