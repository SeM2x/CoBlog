const Bull = require('bull');
const fs = require('fs');

require('dotenv').config();

const fileQueue = new Bull('fileQueue');

fileQueue.process((job) => {
  const { filePath } = job.data;
  if (!filePath) {
    console.log('File path cannot be empty');
  }

  fs.unlink(filePath, (err) => {
    if (err) {
      console.log(err);
    }
  });
});

export default fileQueue;
