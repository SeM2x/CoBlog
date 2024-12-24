import dbClient from '../utils/db';

const { ObjectId } = require('mongodb');

export async function getUserNotifications(req, res) {
  const cursor = req.query.cursor || 0;
  const limit = req.query.limit || 10;
  const { read } = req.query;

  const details = { userId: new ObjectId(req.user.userId) };
  if (read) details.read = read === 'true';
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

  const filter = { _id: new ObjectId(id) };

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
      return res.status(404).json({ status: 'error', message: 'Notification does not exist' });
    }
    return res.status(200).json({ status: 'success' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: 'error', message: 'something went wrong' });
  }
}
