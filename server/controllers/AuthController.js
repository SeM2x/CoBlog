import dbClient from '../utils/db';
import redisClient from '../utils/redis';
import { generateOTP } from '../utils/uuid';

import { hashPassword, isPassword } from '../utils/hashUtils';

const jwt = require('jsonwebtoken');
require('dotenv').config();

export async function createUserAccount(req, res) {
  const {
    firstName, lastName, email, password, username,
  } = req.body;

  if (!email || !password || !username || !firstName || !lastName) {
    return res.status(400).json({ status: 'error', message: 'Name, email, and password are required' });
  }

  // check if user with email already exist
  const user = await dbClient.findData('users', { email });
  if (user) {
    return res.status(409).json({ status: 'error', message: 'User already exists' });
  }

  // Check if user with same username exists
  const usernameExist = await dbClient.findData('users', { username });
  if (usernameExist) {
    return res.status(409).json({ status: 'error', message: 'Username already exists' });
  }

  const hashData = hashPassword(password);
  const newUserData = {
    email,
    firstName,
    lastName,
    Password: hashData.hash,
    username,
    bio: null,
    followerCount: 0,
    followingCount: 0,
    postCount: 0,
    viewsCount: 0,
    metadata: {
      status: 'active', modeOfAuth: 'password', isVerified: true, salt: hashData.salt,
    },
    preference: {},
  };

  try {
    const newUser = await dbClient.insertData('users', newUserData);
    await dbClient.insertData('followings', { userId: newUser.insertedId, followings: [] });
    await dbClient.insertData('followers', { userId: newUser.insertedId, followers: [] });
    await dbClient.insertData('viewshistory', { userId: newUser.insertedId });

    return res.status(201).json({ status: 'success', message: 'User created' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: 'error', message: 'something went wrong' });
  }
}

export async function userSignIn(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ status: 'error', message: 'Email and Password is required' });
  }

  try {
    const user = await dbClient.findData('users', { email });
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not yet exist, Try Signing up' });
    }

    const isMatch = isPassword(password, user.metadata.salt, user.Password);
    if (!isMatch) {
      return res.status(404).json({ status: 'error', message: 'Email or Password incorrect' });
    }

    // Create JWT Token
    const secretKey = process.env.JWT_SECRET_KEY;
    const payload = { userId: user._id.toString(), userEmail: user.email, username: user.username, userProfileUrl: user.profileUrl };
    const plOptions = { expiresIn: '24h' };
    const token = jwt.sign(payload, secretKey, plOptions);
    const {
      metadata, _id, Password, ...data
    } = user;
    data.id = _id.toString();
    return res.status(200).json({
      status: 'success', message: 'Authentication successful', token, data,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: 'error', message: 'something went wrong' });
  }
}

// Change passsword
export async function resetPassword(req, res) {
  // Make sure user requested a password reset and they have the right token.
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({status: 'error', message: 'Email and Password is required'})
  }

  const key = `user:${email}`
  const user = await redisClient.getHashFields(key);
  if (!user) {
    return res.json(400).json({ status: 'error', message: 'User does not request a password reset'});
  }

  if (!user.verified === true) {
    return res.json(400).json({ status: 'error', message: 'Unable to reset user password'})
  }

  await dbClient.updateData('users', { email }, { password })

  //delete Token from redis
  return res.status(200).json({ status: 'success', message: 'Password reset successful, try login' })
}

// Check if OTP is correct
export async function validateToken(req, res) {
  const { email, token } = req.body;

  const key = `user:${email}`
  const user = await redisClient.getHashFields(`user:${email}`);
  if (!token || !email) {
    return res.status(400).json({ status: 'error', message: 'Token and Email is required' })
  }
  if (token === user.token) {
    await redisClient.setHash(key, 60, 'verified', true) // Change time
    return res.status(200).json({
      status: success,
      validated: true,
      message: 'OTP verification successful, proceed to changing password'
    });
  }

  return res.status(404).json({ status: 'error', validated: false, message: 'Wrong OTP' })
}

// Generate OTP
export async function generateResetToken(req, res) {
  // restrict the amount of reset password in an hour
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({status: 'error', message: 'Email is required'})
  }

  const user = await dbClient.findData('users', { email });
  if (!user) {
    return res.status(404).json({ status: 'error', message: 'User does not exist'})
  }
  const key = `user:${email}`
  const token = generateOTP()

  await redisClient.setHash(key, 60, 'email', email, 'verified', false, 'token', token)

  // Send email with token
  // Check if user already requested OTP reset before

  return res.status(200).json({status: 'success', message:'Email sent', token})
}
