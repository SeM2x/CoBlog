import dbClient from '../utils/db';

const { ObjectId } = require('mongodb');

export async function getUserNotifications(req, res) {
  let { cursor, limit } = req.query;

  if (cursor === 'null') {
    return res.status(200).json({ status: 'success', message: 'No more data to fetch', data: [] });
  }

  limit = limit ? (limit + 0) / 10 : 10;
  const userId = new ObjectId(req.user.userId);

  try {
    const pipeline = [
      { $match: { userId, createdAt: { $lt: cursor || new Date().toISOString() } } },
      { $sort: { createdAt: -1 } },
      { $limit: limit + 1 }, // One more data for page pagination info
    ];

    const result = await dbClient.findManyData('notifications', pipeline, true);

    const pageInfo = {
      cursor: result[limit] ? result[limit - 1].createdAt : null,
      hasNext: !!result[limit],
    };

    return res.status(200).json(
      {
        status: 'success',
        data: result.slice(0, limit),
        pageInfo,
      },
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: 'error', message: 'something went wrong' });
  }
}

export async function markNotificationRead(req, res) {
  const { read } = req.query;
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ status: 'error', message: 'id missing' });
  }

  try {
    ObjectId(id);
  } catch (err) {
    return res.status(400).json({ status: 'error', message: 'incorrect id' });
  }

  const filter = { _id: new ObjectId(id), userId: new ObjectId(req.user.userId) };

  let update;
  if (read === 'false') {
    update = { $set: { read: false } }; // mark read as false (unread)
  } else {
    update = { $set: { read: true } }; // default to mark read as true
  }

  try {
    const result = await dbClient.updateData(
      'notifications',
      filter,
      update,
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ status: 'error', message: 'Notification does not exist for this user' });
    }
    return res.status(200).json({ status: 'success' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: 'error', message: 'something went wrong' });
  }
}

export async function deleteNotification(req, res) {
  let { notificationId } = req.params;
  let { userId } = req.user;
  try {
    notificationId = new ObjectId(notificationId);
    userId = new ObjectId(userId);
  } catch (err) {
    return res.status(400).json({ status: 'error', message: 'Incorrect Id' });
  }

  const notification = await dbClient.deleteData('notifications', { _id: notificationId, userId });
  if (notification.deletedCount === 0) {
    return res.status(404).json({ status: 'error', message: 'Notification not found for this user' });
  }
  return res.status(200).json({ status: 'success', message: 'Notification successfully deleted' });
}
