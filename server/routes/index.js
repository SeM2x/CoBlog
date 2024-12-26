import { getStatus, getStats } from '../controllers/AppController';
import { createUserAccount, userSignIn } from '../controllers/AuthController';
import {
  getUserProfileById, followUser, unfollowUser, getUserFollowers, getUserFollowings, editUserData
} from '../controllers/UsersController';
import { authenticate } from '../middlewares/authenticate';
import { getUserNotifications, markNotificationRead } from '../controllers/NotificationsController';

const { Router } = require('express');

export const router = Router();
export const authRouter = Router();
export const userRouter = Router();
export const notificationRouter = Router();

// Protect router
userRouter.use(authenticate);
notificationRouter.use(authenticate);

router.get('/status', getStatus);
router.get('/stats', getStats);
authRouter.post('/create_account', createUserAccount);
authRouter.post('/sign_in', userSignIn);
userRouter.get('/:id/profile', getUserProfileById);
userRouter.put('/:id/follow', followUser);
userRouter.put('/:id/unfollow', unfollowUser);
userRouter.get('/:id/followers', getUserFollowers);
userRouter.get('/:id/followings', getUserFollowings);
userRouter.put('/profile', editUserData);
notificationRouter.get('/me', getUserNotifications);
notificationRouter.get('/:id', markNotificationRead);
