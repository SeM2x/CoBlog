const express = require('express');
const http = require('http');
const cors = require('cors');
import { userRouter, authRouter, router } from './routes/index';

const app = express();

app.use(express.json());

const corsOptions = {
	origin: 'http://localhost:3000'
}
app.use(cors(corsOptions));

app.use('/users', userRouter);
app.use('/auth', authRouter);
app.use('/', router);

const server = http.createServer(app);

const hostname = '0.0.0.0';
const port = '5000';

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});
