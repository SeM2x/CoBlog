import { getStatus, getStats } from '../controllers/AppController';
import { createUserAccount, userSignIn } from '../controllers/AuthController';
import {
  getUserProfileById, followUser, unfollowUser, getUserFollowers,
  getUserFollowings, editUserData, searchUser,
} from '../controllers/UsersController';
import { authenticate } from '../middlewares/authenticate';
import { getUserNotifications, markNotificationRead } from '../controllers/NotificationsController';
import {
  suggestTopics, getUserBlogs, createBlog, inviteUsers, publishBlog, getBlogById, manageInvitation
} from '../controllers/BlogsController';
import { createMessage, getAllMessages } from '../controllers/MessagesController';

const { Router } = require('express');

export const router = Router();
export const authRouter = Router();
export const userRouter = Router();
export const notificationRouter = Router();
export const blogRouter = Router();
export const messageRouter = Router();

// Protect router
userRouter.use(authenticate);
notificationRouter.use(authenticate);
blogRouter.use(authenticate);
messageRouter.use(authenticate);

// Manages all default routes
router.get('/status', getStatus);
router.get('/stats', getStats);

// Manages all Auth routes
authRouter.post('/create_account', createUserAccount);
authRouter.post('/sign_in', userSignIn);

// Manages all Users routes
userRouter.get('/:id/profile', getUserProfileById);
userRouter.put('/:id/follow', followUser);
userRouter.put('/:id/unfollow', unfollowUser);
userRouter.get('/:id/followers', getUserFollowers);
userRouter.get('/:id/followings', getUserFollowings);
userRouter.put('/profile', editUserData);
userRouter.get('/search', searchUser);

// Manages all Notification routes
notificationRouter.get('/me', getUserNotifications);
notificationRouter.put('/:id', markNotificationRead);

// Manages all Blogs routes
blogRouter.get('/topics', suggestTopics);
blogRouter.get('/me', getUserBlogs);
blogRouter.post('/create', createBlog);
blogRouter.put('/:blogId/invite', inviteUsers);
blogRouter.put('/:blogId/publish', publishBlog);
blogRouter.get('/:blogId', getBlogById);
blogRouter.put('/accept|reject', manageInvitation);

// Manages all messages routes
messageRouter.post('/create', createMessage);
messageRouter.get('/:conversationId', getAllMessages);
