const mongoose = require('../../../services/mongoose');

const Exam = mongoose.model(
  'Exam',
  {
    examId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    encryptedContent: { type: String, required: true }, // Encrypted exam content
    threshold: { type: Number, required: true }, // Minimum number of shares required
    sharesSubmitted: [{ organizationId: mongoose.Schema.Types.ObjectId, share: String }],
    isDecrypted: { type: Boolean, default: false },
    duration: { type: Number, required: true },
    startTime: { type: Date, required: true },
    questions: [{ questionId: String, correctAnswer: String }]
  },
  'Exams',
);

module.exports = {
  Exam,
};
