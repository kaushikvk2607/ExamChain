const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  answer: { type: String, required: true },
  signature: { type: String, required: true },
  publicKey: { type: String, required: true },
});

const Answer = mongoose.model('Answer', answerSchema);

module.exports = Answer;
