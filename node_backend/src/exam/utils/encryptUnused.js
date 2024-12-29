const crypto = require('crypto');

const encrypt = (text, secret) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secret), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
};

const storeQuestion = async (content, answer) => {
  const encryptedContent = encrypt(content, secret);
  const encryptedAnswer = encrypt(answer, secret);
  const question = new Question({
    content: encryptedContent,
    answer: encryptedAnswer,
    encrypted: true,
  });
  await question.save();
};

