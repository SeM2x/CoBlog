import dbClient from '../utils/db';
import redisClient from '../utils/redis';
import { generateOTP } from '../utils/uuid';
import { sendAuthenticationOTP, sendVerificationOTP } from '../services/EmailServices';

import { hashPassword, isPassword } from '../utils/hashUtils';

const jwt = require('jsonwebtoken');
require('dotenv').config();

const createAccount = async (email) => {
  const newUserData = {
    bio: null,
    followerCount: 0,
    followingCount: 0,
    postCount: 0,
    viewsCount: 0,
    metadata: {
      status: 'active', modeOfAuth: 'password', isVerified: true,
    },
    preference: {},
  };

  try {
    const newUser = await dbClient.updateData('users', { email }, { $set: newUserData } );
    await dbClient.insertData('followings', { userId: newUser.insertedId, followings: [] });
    await dbClient.insertData('followers', { userId: newUser.insertedId, followers: [] });
    await dbClient.insertData('viewshistory', { userId: newUser.insertedId });

    return true
  } catch (err) {
    console.log(err);
    return false;
  }
}

export async function createUserAccount(req, res) {
  const {
    firstName, lastName, email, password, username,
  } = req.body;

  if (!email || !password || !username || !firstName || !lastName) {
    return res.status(400).json({ status: 'error', message: 'Name, email, and password are required' });
  }

  // check if user with email already exist and verified
  const user = await dbClient.findData('users', { email });
  if (user && user.metadata.isVerified) {
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
    metadata: { isVerified: false, salt: hashData.salt }
  }

   // Update unverified user data with new data
   if (user && !user.metadata.isVerified) {
    await dbClient.updateData('users', { email }, { $set: newUserData })
   } else {
    await dbClient.insertData('users', newUserData);
   }

  const key = `user:auth:${email}`;
  const exp = 5 * 60;
  const token = generateOTP();

  try {

    await redisClient.setHash(key, exp + 1, 'email', email, 'verified', false, 'token', token) // (exp + 1) for email delivery
    await sendAuthenticationOTP(userData, token, exp) // Send Authentication Email
  } catch(err) {
    console.log(err)
    return res.status(500).json({ status: 'error', message: 'Something went wrong'})
  }

  return res.status(200).json({ status: 'success', message: 'User Data verified, Proceed to account verification'})

}

export async function verifyUserAccount(req, res) {
  const { email, token } = req.body;
  if (!token || !email) {
    return res.status(400).json({ status: 'error', message: 'Token and Email is required' })
  }

  const key = `user:auth:${email}`
  const user = await redisClient.getHashField(key);
  if (!user) {
    return res.status(401).json({
      status: 'error',
      message: 'Token is either expired or not requested'
    });
  }

  if (token === user.token) {
    const accountCretated = await createAccount(email);
    if (accountCretated) {
      return res.status(201).json({ status: 'success', validated: true, message: 'Account verified successfully, proceed to login' })
    }

    return res.status(500).json({ status: 'error', message: 'Something went wrong' })
  }

  return res.status(404).json({ status: 'error', validated: false, message: 'Invalid OTP' })
}

export async function userSignIn(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ status: 'error', message: 'Email and Password is required' });
  }

  try {
    const user = await dbClient.findData('users', { email });
    if (!user || !user.metadata.isVerified) {
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
  const user = await redisClient.getHashField(key);

  if (!user) {
    return res.status(401).json({ status: 'error', message: 'Token timeout, request a new one'});
  }

  if (user.verified === 'false') {
    return res.status(401).json({ status: 'error', message: 'Unable to reset user password' });
  }

  const hashData = hashPassword(password);
  await dbClient.updateData('users', { email }, { $set: { Password: hashData.hash, 'metadata.salt': hashData.salt  } });

  //delete Token from redis
  return res.status(200).json({ status: 'success', message: 'Password reset successful, try login' })
}

// Check if OTP is correct
export async function validateToken(req, res) {
  const { email, token } = req.body;

  if (!token || !email) {
    return res.status(400).json({ status: 'error', message: 'Token and Email is required' })
  }

  const key = `user:$reset{email}`
  const user = await redisClient.getHashField(`user:${email}`);
  if (!user) {
    return res.status(401).json({
      status: 'error',
      message: 'Token is either expired or not requested'
    });
  }

  const exp = 4 * 60;
  if (token === user.token) {
    await redisClient.setHash(key, exp, 'verified', true)
    return res.status(200).json({
      status: 'success',
      validated: true,
      message: 'OTP verification successful, proceed to changing password'
    });
  }

  return res.status(404).json({ status: 'error', validated: false, message: 'Invalid OTP' })
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
  const key = `user:reset:${email}`
  const exp = 5 * 60;
  const token = generateOTP()
  const userData = {
    email: user.email,
    username: user.username
  }

  // Check if user already requested OTP reset before
  const userExist = await redisClient.getHashField(key);
  if (userExist) {
    return res.status(200).json({ status: 'success', message: 'Proceed with token generation again after 5 minutes'})
  }
  
  try {
    await redisClient.setHash(key, exp + 1, 'email', email, 'verified', false, 'token', token) // (exp + 1) for email delivery
    await sendVerificationOTP(userData, token, exp) // Send email with token
  } catch (err) {
    console.log(err)
    return res.status(500).json({ status: 'error', message: 'Something went wrong, request token generation again' })
  }
  
  return res.status(200).json({ status: 'success', message:'Email sent', tokenTimeOut: exp })
}
