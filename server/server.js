import { userRouter, authRouter, router } from './routes/index';

const express = require('express');
const http = require('http');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

app.use(express.json());
app.use(morgan('dev'));

const corsOptions = {
  origin: 'http://localhost:3000',
};
app.use(cors(corsOptions));

app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api', router);

const server = http.createServer(app);

const hostname = '0.0.0.0';
const port = '5000';

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
