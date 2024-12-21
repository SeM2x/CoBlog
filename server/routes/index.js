import { getStatus, getStats } from '../controllers/AppController';
import { createUserAccount, userSignIn } from '../controllers/AuthController';
import {
  getUserById, followUser, unfollowUser, getUserFollowers, getUserFollowings,
} from '../controllers/UsersController';
import { authenticate } from '../middlewares/authenticate';

const { Router } = require('express');

export const router = Router();
export const authRouter = Router();
export const userRouter = Router();

// Protect router
userRouter.use(authenticate);

router.get('/status', getStatus);
router.get('/stats', getStats);
authRouter.post('/create_account', createUserAccount);
authRouter.post('/sign_in', userSignIn);
userRouter.get('/:id', getUserById);
userRouter.put('/:id/follow', followUser);
userRouter.put('/:id/unfollow', unfollowUser);
userRouter.get('/:id/followers', getUserFollowers);
userRouter.get('/:id/followings', getUserFollowings);
