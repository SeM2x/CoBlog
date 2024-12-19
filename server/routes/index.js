import { getStatus, getStats } from '../controllers/AppController';
import { createUserAccount, userSignIn } from '../controllers/AuthController';
import { getUserById } from '../controllers/UsersController';
import { authenticate } from '../middlewares/authenticate';

const { Router } = require('express');

export const router = Router();
export const authRouter = Router();
export const userRouter = Router();


// Protect routes
userRouter.use(authenticate);

router.get('/status', getStatus);
router.get('/stats', getStats);
authRouter.post('/create_account', createUserAccount);
authRouter.post('/sign_in', userSignIn);
userRouter.get('/:id', getUserById);
