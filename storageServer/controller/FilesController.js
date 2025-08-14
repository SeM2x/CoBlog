import { avatarUpload, MulterError } from '../utils/MulterConfig'

const { ObjectId } = require('mongodb');
const fs = require('fs').promises;
const dbClient = require('../utils/storageDb');
const serverName = process.env.STORAGE_SERVER_URL;

export function UploadUserAvatar(req, res) {
  avatarUpload(req, res, async (err) => {
    const userId = new ObjectId(req.user.userId);
    if (err instanceof MulterError) {
      return res.status(400).json({ status: 'error', message: 'File must not exceed 2MB' });
    }
    if (req.fileError) {
      return res.status(400).json({ status: 'error', message: req.fileError.message });
    }
    try {
      const details = { ...req.file };
      if (!details.filename) {
        return res.status(400).json({ status: 'error', message: 'File expected in form data'});
      }

      details.userId = userId;
      details.profileUrl = `${serverName}media/avatar/${req.localFileName}`;

      // Check if a user already have avatar uploaded
      const query = await dbClient.findData('storage', { userId, fieldname: 'avatar' });
      if (query) {
        if (query.filename !== details.filename) {
          await fs.unlink(query.path) // delete existing file with diff ext
	}
        await dbClient.deleteData('storage', { userId, fieldname: 'avatar' });
      }

      await dbClient.insertData('storage', details);

      return res.status(200).json({ status: 'success', message: 'Image uploaded successfully', data: { profileUrl: details.profileUrl } });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ status: 'error', message: 'Something went wrong' });
    }
  });
}
