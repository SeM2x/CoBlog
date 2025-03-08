import { authenticate } from './middlewares/authenticate';

import { fileUpload } from './controller/FilesController';

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(authenticate);

app.use('/images', express.static('/home/ubuntu/storage'));

app.post('/images/avatar_upload', UploadUserAvatar);

app.listen(3000, () => console.log('Storage server started'));
