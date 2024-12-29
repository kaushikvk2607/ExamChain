const secret = Buffer.from('super_secret_key'); // Your encryption key
const crypto = require('crypto');
const shares = sss.split(secret, { shares: 10, threshold: 7 }); // Adjust threshold as needed

// Distribute shares among organizations
const distributeShares = async () => {
    const orgs = await Organization.find({});
    orgs.forEach((org, index) => {
        org.share = shares[index].toString('hex');
        org.save();
    });
};

const encrypt = (text, secret) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secret), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
};

const storeQuestion = async (content, answer, organizationId) => {
    const organization = await Organization.findById(organizationId);
    const secret = Buffer.from(organization.secretKey, 'hex'); // Ensure organization.secretKey is stored securely
    const encryptedContent = encrypt(content, secret);
    const encryptedAnswer = encrypt(answer, secret);
    const question = new Question({
        content: encryptedContent,
        answer: encryptedAnswer,
        encrypted: true,
        organizationId,
    });
    await question.save();
};
const decrypt = (text, secret) => {
    const [iv, encryptedText] = text.split(':');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secret), Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(Buffer.from(encryptedText, 'hex'));
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  };
  
  const decryptQuestionsForExam = async (organizationId) => {
    const organization = await Organization.findById(organizationId);
    const secret = Buffer.from(organization.secretKey, 'hex'); // Ensure organization.secretKey is stored securely
    const questions = await Question.find({ organizationId, encrypted: true });
    questions.forEach(question => {
      question.content = decrypt(question.content, secret);
      question.answer = decrypt(question.answer, secret);
      question.encrypted = false;
      question.save();
    });
  };
