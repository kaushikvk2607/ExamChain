const crypto = require('crypto');
const mongoose = require('mongoose');
const { Student } = require('../models/Student');
const { Question } = require('../models/Question');
const Answer = require('../models/Answer');

const submitAnswers = async (req, res) => {
  const { answers } = req.body;
  console.log('Received answers:', answers);

  try {
    for (const answer of answers) {
      console.log('Processing answer:', answer);

      const { message, signature, publicKey } = answer;
      const { questionId, answer: studentAnswer, examId } = JSON.parse(message);
      console.log('Parsed message:', { questionId, studentAnswer, examId });

      // Verify the signature
      const verify = crypto.createVerify('SHA256');
      verify.update(message);
      verify.end();
      const isVerified = verify.verify(publicKey, Buffer.from(signature, 'base64'));
      console.log('Signature verified:', isVerified);

      if (!isVerified) {
        console.warn('Signature verification failed for answer:', answer);
        return res.status(400).json({ message: 'Signature verification failed' });
      }

      // Save the answer to the database
      const student = await Student.findOne({ examId });
      if (!student) {
        console.warn('Student not found for examId:', examId);
        return res.status(404).json({ message: 'Student not found' });
      }

      const newAnswer = new Answer({
        questionId: mongoose.Types.ObjectId(questionId),
        studentId: student._id,
        answer: studentAnswer,
        signature,
        publicKey
      });

      await newAnswer.save();
      console.log('Answer saved for questionId:', questionId);
    }

    console.log('All answers submitted successfully');
    return res.status(201).json({ message: 'Answers submitted successfully' });
  } catch (error) {
    console.error('Error submitting answers:', error);
    return res.status(500).json({ status: 500, message: 'Internal server error', error });
  }
};

const calculateResults = async (req, res) => {
  const { examId } = req.body;

  try {
    const questions = await Question.find({ examId: mongoose.Types.ObjectId(examId) });
    const answers = await Answer.find({ 'questionId.examId': mongoose.Types.ObjectId(examId) });

    const results = {};

    answers.forEach((answer) => {
      const question = questions.find(q => q._id.equals(answer.questionId));
      if (!question) {
        return;
      }

      const isCorrect = question.answer === answer.answer;
      if (!results[answer.studentId]) {
        results[answer.studentId] = { correct: 0, total: 0 };
      }

      results[answer.studentId].total += 1;
      if (isCorrect) {
        results[answer.studentId].correct += 1;
      }
    });

    const finalResults = Object.keys(results).map(studentId => ({
      studentId,
      correct: results[studentId].correct,
      total: results[studentId].total,
      percentage: (results[studentId].correct / results[studentId].total) * 100
    }));

    return res.status(200).json({ message: 'Results calculated successfully', results: finalResults });
  } catch (error) {
    console.error('Error calculating results:', error);
    return res.status(500).json({ status: 500, message: 'Internal server error', error });
  }
};

module.exports = {
  submitAnswers,
  calculateResults,
};
