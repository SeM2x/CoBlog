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
  resp.relationship = null;

  if (id === req.user.userId) {
    resp.relationship = 'me';
  }

  if (!resp.relationship) {
    const userFollowers = await dbClient.findData('followers', { userId: new ObjectId(req.user.userId) });
    if (userFollowers.followers.some((follower) => follower.equals(new ObjectId(id)))) {
      resp.relationship = 'follows you';
    }
  }

  if (!resp.relationship) {
    const userFollowings = await dbClient.findData('followings', { userId: new ObjectId(req.user.userId) });
    if (userFollowings.followings.some((following) => following.equals(new ObjectId(id)))) {
      resp.relationship = 'following';
    }
  }
  return res.status(200).json({ status: 'success', data: resp });
}

export async function followUser(req, res) {
  const { id } = req.params;
  if (id === req.user.userId) {
    return res.status(409).json({ status: 'error', message: "You can't follow yourself" });
  }
  // Update target user followers
  try {
    const result = await dbClient.updateData(
      'followers',
      { userId: new ObjectId(id) },
      { $addToSet: { followers: new ObjectId(req.user.userId) } },
    );

    // Stop process if user does not exist
    if (result.matchedCount === 0) {
      return res.status(404).json({ status: 'error', message: 'User does not exist' });
    }

    // Stop process if targetUser already exist in currentUser followers
    if (result.modifiedCount === 0) {
      return res.status(409).json(
        { status: 'error', message: 'You are already following this user.' },
      );
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: 'error', message: 'Something went wrong' });
  }

  try {
    // Update Current user followings
    await dbClient.updateData(
      'followings',
      { userId: new ObjectId(req.user.userId) },
      { $addToSet: { followings: new ObjectId(id) } },
    );

    // Update Current User follower count
    await dbClient.updateData(
      'users',
      { _id: new ObjectId(req.user.userId) },
      { $inc: { followingCount: 1 } },
    );

    // Update target user following count
    await dbClient.updateData(
      'users',
      { _id: new ObjectId(id) },
      { $inc: { followerCount: 1 } },
    );

    // Create Notification

    res.status(200).json({ status: 'success', message: 'user followed successfully' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: 'error', message: 'Something went wrong' });
  }
}

export async function unfollowUser(req, res) {
  const { id } = req.params;
  if (id === req.user.userId) {
    return res.status(409).json({ status: 'error', message: "You can't unfollow yourself" });
  }
  // Update target user followers
  try {
    const result = await dbClient.updateData(
      'followers',
      { userId: new ObjectId(id) },
      { $pull: { followers: new ObjectId(req.user.userId) } },
    );

    // Stop process if user does not exist
    if (result.matchedCount === 0) {
      return res.status(404).json({ status: 'error', message: 'User does not exist' });
    }

    // Stop process if targetUser already exist in currentUser followers
    if (result.modifiedCount === 0) {
      return res.status(409).json(
        { status: 'error', message: 'You are not following this user.' },
      );
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: 'error', message: 'Something went wrong' });
  }

  try {
    // Update Current user followings
    await dbClient.updateData(
      'followings',
      { userId: new ObjectId(req.user.userId) },
      { $pull: { followings: new ObjectId(id) } },
    );

    // Update current User following count
    await dbClient.updateData(
      'users',
      { _id: new ObjectId(req.user.userId) },
      { $inc: { followingCount: -1 } },
    );

    // Update target user follower count
    await dbClient.updateData(
      'users',
      { _id: new ObjectId(id) },
      { $inc: { followerCount: -1 } },
    );

    // Create Notification

    res.status(200).json({ status: 'success', message: 'user unfollowed successfully' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: 'error', message: 'Something went wrong' });
  }
}
