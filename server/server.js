import {
  userRouter, authRouter, router,
  notificationRouter, blogRouter, messageRouter,
} from './routes/index';

const express = require('express');
const http = require('http');
const cors = require('cors');
const morgan = require('morgan');
const socketIo = require('socket.io');
const { initSocket } = require('./socket');

const app = express();

app.use(express.json());
app.use(morgan('dev'));

const origin = 'https://coblog.semx.tech'; // Cors origin

// API server
const corsOptions = {
  origin,
};

app.use(cors(corsOptions));

app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/blogs', blogRouter);
app.use('/api/messages', messageRouter);
app.use('/api', router);

// Socket server
const socketConfig = {
  cors: {
    origin,
  },
};

const server = http.createServer(app);
const io = socketIo(server, socketConfig);
initSocket(io);

// Start server
const hostname = '0.0.0.0';
const port = '5000';

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
