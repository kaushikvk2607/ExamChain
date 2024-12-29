const mongoose = require('../../../services/mongoose');

const Question = mongoose.model(
  'Question',
  {
    content: { type: String, required: true },
    options: {
      a: { type: String, required: true },
      b: { type: String, required: true },
      c: { type: String, required: true },
      d: { type: String, required: true },
    },
    answer: { type: String, required: true },
    examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
    encrypted: {
      type: Boolean,
      default: true,
    },
  },
  'questions'
);

module.exports = {
  Question,
};
