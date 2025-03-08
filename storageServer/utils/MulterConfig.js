const { ObjectId } = require('mongodb');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Storage config
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, `/home/ubuntu/${file.fieldname}/storage`);
  },
  filename(req, file, cb) {
    let fname;
    if (file.fieldname === 'avatar') {
      fname = `${file.fieldname}_${req.user.userId}${path.extname(file.originalname)}`
    } else {
      fname = `${file.fieldname}_${uuidv4()}${path.extname(file.originalname)}`;
    }
    req.localFileName = fname;
    cb(null, fname);
  },
});

//File filter Config
const supportedFileTypes = ['image/png', 'image/jpeg', 'image/jpg'];
const fileFilter = (req, file, cb) => {
  if (!supportedFileTypes.includes(file.mimetype)) {
    req.fileError = new Error('Unsupported file type');
    cb(req.fileError, false);
  } else {
    cb(null, true);
  }
};

export const avatarUpload = multer(
  {
    storage,
    limits: { fileSize: 1024 * 1024 * 2 },
    fileFilter,
  },
).single('avatar');
