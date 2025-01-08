import dbClient from '../utils/db';

const { ObjectId } = require('mongodb');

export async function createMessage(req, res) {
  let { blogId, conversationId, message } = req.body;
  if (!blogId || !conversationId || !message) {
    return res.status(400).json({ status: 'error', message: 'blogId, conversationId, message are required' });
  }

  try {
    blogId = ObjectId(blogId);
  } catch (err) {
    return res.status(400).json({ status: 'error', message: 'Incorrect Id' });
  }

  const details = {
    conversationId,
    senderId: new ObjectId(req.user.userId),
    senderUsername: req.user.username,
    blogId,
    message,
  };

  try {
    await dbClient.insertData('messages', details);
    const { _id, updatedAt, ...data } = details;
    data.messageId = _id;

    return res.status(200).json({ status: 'success', message: 'message created', data });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'something went wrong' });
  }
}

export async function getAllMessages(req, res) {
  const { conversationId } = req.params;

  try {
    const result = await dbClient.findManyData('messages', { conversationId });
    return res.status(200).json({ status: 'success', data: result });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Something went wrong' });
  }
}

export async function getMessageById(req, res) {
  const { conversationId, messageId } = req.params;
  try {
    const result = await dbClient.findData('messages', { conversationId, messageId });
    return res.status(200).json({ status: 'success', data: result });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Something went wrong' });
  }
}
