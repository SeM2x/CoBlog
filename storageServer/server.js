import { authenticate } from './middlewares/authenticate';

import { UploadUserAvatar } from './controller/FilesController';

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(authenticate);

app.use('/media/avatar', express.static('/home/ubuntu/storage/avatar'));

app.post('/media/upload_avatar', UploadUserAvatar);

app.listen(3000, () => console.log('Storage server started'));
