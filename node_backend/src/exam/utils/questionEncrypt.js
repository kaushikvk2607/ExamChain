const crypto = require('crypto');

const encrypt = (text, key) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + encrypted;
};

const decrypt = (encryptedContent, key) => {
  const keyBuffer = Buffer.from(key, 'hex');
  const ivBuffer = Buffer.from(encryptedContent.slice(0, 32), 'hex'); // First 32 hex chars (16 bytes) for IV
  const encryptedText = encryptedContent.slice(32); // Remaining chars for the encrypted content

  const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, ivBuffer);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};

module.exports = { encrypt, decrypt };
