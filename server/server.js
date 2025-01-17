import { userRouter, authRouter, router, notificationRouter, blogRouter, messageRouter } from './routes/index';

const express = require('express');
const http = require('http');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

app.use(express.json());
app.use(morgan('dev'));

const corsOptions = {
  origin: 'https://coblog.semx.tech/',
};
app.use(cors(corsOptions));

app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/blogs', blogRouter);
app.use('/api/messages', messageRouter);
app.use('/api', router);

export const server = http.createServer(app);
