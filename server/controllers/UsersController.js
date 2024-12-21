import dbClient from '../utils/db';

const { ObjectId } = require('mongodb');

export async function getUserProfileById(req, res) {
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

    return res.status(200).json({ status: 'success', message: 'user followed successfully' });
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

    return res.status(200).json({ status: 'success', message: 'user unfollowed successfully' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: 'error', message: 'Something went wrong' });
  }
}

export async function getUserFollowers(req, res) {
  const { id } = req.params;
  const cursor = req.query.cursor || 0;
  const limit = req.query.limit || 10;

  const result = await dbClient.findData('followers', { userId: new ObjectId(id) });
  if (!result) {
    return res.status(404).json({ status: 'error', message: 'User does not exist' });
  }
  // Paginate resp
  const endIdx = cursor + limit;
  const paginatedFollowerId = result.followers.slice(cursor, endIdx);
  const pageInfo = {
    cursor: result.followers[endIdx] ? endIdx : null,
    hasNext: !!result.followers[endIdx],
  };
  if (!paginatedFollowerId[0]) {
    return res.status(200).json({ status: 'success', data: [], pageInfo });
  }
  const getFollowerPromise = paginatedFollowerId.map((follower) => dbClient.findData('users', { _id: follower }));
  Promise.all(getFollowerPromise)
    .then((results) => {
      const resp = results.map((result) => ({
        id: result._id,
        username: result.username,
        bio: result.bio,
      }));
      return res.status(200).json({ status: 'success', data: resp, pageInfo });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ status: 'error', message: 'something went wrong' });
    });
}

export async function getUserFollowings(req, res) {
  const { id } = req.params;
  const cursor = req.query.cursor || 0;
  const limit = req.query.limit || 10;

  const result = await dbClient.findData('followings', { userId: new ObjectId(id) });
  if (!result) {
    return res.status(404).json({ status: 'error', message: 'User does not exist' });
  }
  // Paginate resp
  const endIdx = cursor + limit;
  const paginatedFollowingId = result.followings.slice(cursor, endIdx);
  const pageInfo = {
    cursor: result.followings[endIdx] ? endIdx : null,
    hasNext: !!result.followings[endIdx],
  };
  if (!paginatedFollowingId[0]) {
    return res.status(200).json({ status: 'success', data: [], pageInfo });
  }
  const getFollowingPromise = paginatedFollowingId.map((following) => dbClient.findData('users', { _id: following }));
  Promise.all(getFollowingPromise)
    .then((results) => {
      const resp = results.map((result) => ({
        id: result._id,
        username: result.username,
        bio: result.bio,
      }));
      return res.status(200).json({ status: 'success', data: resp, pageInfo });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ status: 'error', message: 'something went wrong' });
    });
}
