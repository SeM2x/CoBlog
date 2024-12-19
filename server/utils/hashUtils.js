const crypto = require('crypto');

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const newPassword = salt + password;
  const hash = crypto.createHash('sha256');
  hash.update(newPassword);
  return { hash: hash.digest('hex'), salt };
}

export function isPassword(plainPassword, salt, hashedPassword) {
  const newPassword = salt + plainPassword;
  const hash = crypto.createHash('sha256');
  hash.update(newPassword);
  if (hash.digest('hex') === hashedPassword) {
    return true;
  }
  return false;
}
