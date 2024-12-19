import dbClient from '../utils/db';
import { hashPassword, isPassword } from '../utils/hashUtils';

const jwt = require('jsonwebtoken');
require('dotenv').config();

export async function createUserAccount(req, res) {
  const {
    firstName, lastName, email, password, username,
  } = req.body;

  if (!email || !password || !username) {
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
    await dbClient.insertData('userFollows', { userId: newUser.insertedId, followers: [], following: [] });

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
    const payload = { userId: user._id.toString(), userEmail: user.email };
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
