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

  if (id === req.user.userId) {
    resp.relationship = 'me';
  } else {
    const followSys = await dbClient.findData('userFollows', { userId: new ObjectId(req.user.userId) });
    if (followSys.followers.includes(new ObjectId(id))) {
      resp.relationship = 'follows you';
    } else if (followSys.following.includes(new ObjectId(id))) {
      resp.relationship = 'following';
    } else {
      resp.relationship = null;
    }
  }
  return res.status(200).json({ status: 'success', data: resp });
}
