const jwt = require('jsonwebtoken');
require('dotenv').config();

export const authenticate = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized' });
  }
  const token = authorization.split(' ')[1];
  if (!token) {
    return res.status(403).json({ status: 'error', message: 'Access Denied. Token missing' });
  }

  const secretKey = process.env.JWT_SECRET_KEY;
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ status: 'error', message: 'Invalid Token' });
    }
    req.user = decoded;
    next();
  });
};
