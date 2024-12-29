const { combineShares } = require('../utils/shamir-secret');
const { Organization } = require('../models/Organization');

let sharesReceived = [];

const submitShare = async (req, res) => {
  const { organizationId, share } = req.body;

  try {
    const organization = await Organization.findById(organizationId);

    if (!organization) {
      return res.status(404).json({ status: 404, message: 'Organization not found' });
    }

    sharesReceived.push(Buffer.from(share, 'hex'));

    return res.status(200).json({ message: 'Share received' });
  } catch (error) {
    return res.status(500).json({ status: 500, message: 'Internal server error', error });
  }
};

const decryptQuestionsIfThresholdMet = async (req, res) => {
  const { threshold } = req.body;

  if (sharesReceived.length >= threshold) {
    try {
      const secretKey = combineShares(sharesReceived);
      sharesReceived = []; // Clear shares after combining

      // Find all encrypted questions
      const questions = await Question.find({ encrypted: true });

      const decryptedQuestions = questions.map((question) => {
        const decryptedContent = decrypt(question.content, secretKey);
        const decryptedOptions = {
          a: decrypt(question.options.a, secretKey),
          b: decrypt(question.options.b, secretKey),
          c: decrypt(question.options.c, secretKey),
          d: decrypt(question.options.d, secretKey),
        };
        const decryptedAnswer = decrypt(question.answer, secretKey);

        return {
          ...question._doc,
          content: decryptedContent,
          options: decryptedOptions,
          answer: decryptedAnswer,
          encrypted: false,
        };
      });

      // Update the questions in the database
      for (let decryptedQuestion of decryptedQuestions) {
        await Question.findByIdAndUpdate(decryptedQuestion._id, decryptedQuestion);
      }

      return res.status(200).json({ message: 'Questions decrypted successfully' });
    } catch (error) {
      return res.status(500).json({ status: 500, message: 'Internal server error', error });
    }
  } else {
    return res.status(400).json({ message: 'Not enough shares received yet' });
  }
};

module.exports = { decryptQuestionsIfThresholdMet };
