import dbClient from '../utils/db';

const { ObjectId } = require('mongodb');

export async function getUserById(req, res) {
  const { id } = req.params;
  const user = await dbClient.findData('users', { _id: new ObjectId(id) });
  if (!user) {
    return res.status(404).json({ status: 'error', message: 'User not found' });
  }

  const {
    _id, preference, email, metadata, Password, updatedAt, viewsCount, ...resp
  } = user;

  resp.id = _id.toString();
  return res.status(200).json({ status: 'success', data: resp });
}
