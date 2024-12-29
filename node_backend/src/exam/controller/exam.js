const crypto = require('crypto');
const sss = require('shamirs-secret-sharing');
const { Exam } = require('../models/Exam');
const { Organization } = require('../models/Organization');
const { Question } = require('../models/Question');
const { decrypt } = require('../utils/questionEncrypt');

const generateSecretKey = () => crypto.randomBytes(32).toString('hex');

const encryptContent = (content, key) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
  let encrypted = cipher.update(content, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + encrypted; // prepend iv to the encrypted content
};

const decryptContent = (encryptedContent, key) => {
  if (key.length !== 64) { // Hex string of 32 bytes should be 64 characters long
    throw new Error('Invalid key length');
  }
  const iv = Buffer.from(encryptedContent.slice(0, 32), 'hex'); // extract iv
  const encryptedText = encryptedContent.slice(32); // get encrypted text
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

// Create an exam
const createExam = async (req, res) => {
  const { title, content, organizationIds, threshold } = req.body;

  try {
    // Generate a secret key
    const secretKey = generateSecretKey();
    console.log('Generated Secret Key:', secretKey);

    // Encrypt the exam content
    const encryptedContent = encryptContent(content, secretKey);

    // Split the secret key into shares
    const shares = sss.split(Buffer.from(secretKey, 'hex'), { shares: organizationIds.length, threshold });
    console.log('Generated Shares:', shares.map(share => share.toString('hex')));

    // Create the exam
    const exam = new Exam({
      title,
      encryptedContent,
      threshold,
      sharesSubmitted: [],
      isDecrypted: false,
    });
    await exam.save();

    // Assign shares to organizations
    for (let i = 0; i < organizationIds.length; i++) {
      await Organization.findByIdAndUpdate(organizationIds[i], { share: shares[i].toString('hex') });
    }

    res.status(201).json({
      message: 'Exam created successfully',
      secretKey, // Send the secret key to the admin for distribution
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: 'Internal server error', error });
  }
};


// Submit a share and decryption key
const submitShare = async (req, res) => {
  const { examId, organizationId, share } = req.body;

  try {
    const exam = await Exam.findById(examId);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    // Add the share to the exam
    exam.sharesSubmitted.push({ organizationId, share });
    await exam.save();
    console.log('Shares Submitted:', exam.sharesSubmitted);

    // Check if the threshold is met
    if (exam.sharesSubmitted.length >= exam.threshold) {
      // Combine shares to reconstruct the secret key
      const shares = exam.sharesSubmitted.map(s => Buffer.from(s.share, 'hex'));
      console.log('Combining Shares:', shares);
      const secretKey = sss.combine(shares).toString('hex');
      console.log('Reconstructed Secret Key:', secretKey);
      console.log('Secret Key Length:', secretKey.length); // Log the length of the reconstructed key

      // Verify key length
      if (secretKey.length !== 64) {
        throw new Error('Reconstructed key length is incorrect');
      }

      // Decrypt the exam content
      const decryptedContent = decrypt(exam.encryptedContent, secretKey);
      console.log('Decrypted Content:', decryptedContent);

      // Update the exam as decrypted and store decrypted content
      exam.isDecrypted = true;
      exam.decryptedContent = decryptedContent;
      await exam.save();

      res.status(200).json({ message: 'Exam and questions decrypted successfully', content: decryptedContent });
    } else {
      res.status(200).json({ message: 'Share submitted successfully', remainingShares: exam.threshold - exam.sharesSubmitted.length });
    }
  } catch (error) {
    console.error('Error during share submission:', error);
    res.status(500).json({ status: 500, message: 'Internal server error', error });
  }
};

//TO share the questions with the answer given to the db with encryption and signed by their private key with their enrollment number


// Result calculator

//results getter

//upload the csv or excel file of roll numbers


// Get all exams
const getExams = async (req, res) => {
  try {
    const exams = await Exam.find();
    res.status(200).json(exams);
  } catch (error) {
    res.status(500).json({ status: 500, message: 'Internal server error', error });
  }
};

module.exports = {
  createExam,
  submitShare,
  getExams
};
