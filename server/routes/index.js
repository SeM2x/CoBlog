import { getStatus, getStats } from '../controllers/AppController';
import { createUserAccount, userSignIn } from '../controllers/AuthController';
import { getUserById } from '../controllers/UsersController';

const jwt = require('jsonwebtoken');

export const router = require('express').Router();
export const authRouter = require('express').Router();
export const userRouter = require('express').Router();

require('dotenv').config();

const authenticate = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized' });
  }
  const token = authorization.split(' ')[1];
  if (!token) {
    return res.status(403).json({ status: 'error', message: 'Access Denied. Token missing' });
  }

  const secretKey = process.env.JWT_SECRET_KEY
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ status: 'error', message: 'Invalid Token' });
    }
    req.user = decoded;
    next();
  });
};

// Protected routes
userRouter.use(authenticate);

router.get('/status', getStatus);
router.get('/stats', getStats);
authRouter.post('/create_account', createUserAccount);
authRouter.post('/sign_in', userSignIn);
userRouter.get('/:id', getUserById);
