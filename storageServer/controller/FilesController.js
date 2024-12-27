import fileQueue from '../worker';

const { ObjectId } = require('mongodb');
const multer = require('multer');
const path = require('path');

const serverName = process.env.STORAGE_SERVER_URL;
const { v4: uuidv4 } = require('uuid');
const dbClient = require('../utils/storageDb');

// Multer config
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, '/home/ubuntu/storage');
  },
  filename(req, file, cb) {
    const fname = `${file.fieldname}_${uuidv4()}${path.extname(file.originalname)}`;
    req.localFileName = fname;
    cb(null, fname);
  },
});

const supportedFileTypes = ['image/png', 'image/jpeg', 'image/jpg'];
const fileFilter = (req, file, cb) => {
  console.log('In the filter');
  if (!supportedFileTypes.includes(file.mimetype)) {
    req.fileError = new Error('Unsupported file type');
    cb(req.fileError, false);
  } else {
    cb(null, true);
  }
};

const upload = multer(
  {
    storage,
    limits: { fileSize: 1024 * 1024 * 2 },
    fileFilter,
  },
).single('avatar');

export function fileUpload(req, res) {
  upload(req, res, async (err) => {
    const userId = new ObjectId(req.user.userId);
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ status: 'error', message: 'File must not exceed 2MB' });
    }
    if (req.fileError) {
      return res.status(400).json({ status: 'error', message: req.fileError.message });
    }
    try {
      const details = { ...req.file };
      details.userId = userId;
      details.profileUrl = `${serverName}${req.localFileName}`;

      // Check if a user already have avatar uploaded
      const search = await dbClient.findData('storage', { userId, fieldname: 'avatar' });
      if (search) {
        await dbClient.deleteData('storage', { userId, fieldname: 'avatar' });
        fileQueue.add({ filePath: search.path }); // Create a job to delete avatar in storage
      }
      await dbClient.insertData('storage', details);

      return res.status(200).json({ status: 'success', message: 'Image uploaded successfully', data: { profileUrl: details.profileUrl } });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ status: 'error', message: 'Something went wrong' });
    }
  });
}

// Log job completion or failure
fileQueue.on('failed', (job, err) => {
  console.log(`Job ${job.id} failed with error: ${err.message}`);
});

fileQueue.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});
