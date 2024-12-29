const sss = require('shamirs-secret-sharing');
const crypto = require('crypto');

const encrypt = (text, key) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + encrypted;
};

const decrypt = (text, key) => {
  const iv = Buffer.from(text.slice(0, 32), 'hex');
  const encryptedText = text.slice(32);
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

const splitSecret = (secret, totalShares, threshold) => {
  const secretBuffer = Buffer.from(secret);
  return sss.split(secretBuffer, { shares: totalShares, threshold });
};

const combineShares = (shares) => {
  return sss.combine(shares).toString('utf8');
};

module.exports = { encrypt, decrypt, splitSecret, combineShares };
