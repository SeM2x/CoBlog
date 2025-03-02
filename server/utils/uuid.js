const { v4: uuidv4 } = require('uuid');

export default function generateId () {
  const newUuid = uuidv4();
  return newUuid;
};


export function generateOTP() {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
}