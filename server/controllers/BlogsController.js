import dbClient from '../utils/db';
import generateId from '../utils/uuid';

const { ObjectId } = require('mongodb');

export async function createBlogRoomId(req, res) {
  const data = {
    authorId: new ObjectId(req.user.userId),
    roomId: generateId(),
  };
  return res.status(200).json({ status: 'success', data });
}

export async function suggestTopics(req, res) {
  try {
    const result = await dbClient.findManyData('topics', {});
    return res.status(200).json({ status: 'success', data: result });
  } catch (err) {
    return res.status(500).json({ status: 'error', Message: 'Something went wrong' });
  }
}
