const { v4: uuidv4 } = require('uuid');

export default function generateId () {
  const newUuid = uuidv4();
  return newUuid;
};
