const express = require('express');
const router = express.Router();
const { checkIfOrganization, checkIfAuthenticated, checkIfAdmin } = require('../../middlewares/validateAuth');
const { createQuestion, decryptQuestion, decryptAllQuestions, getAllQuestions, getQuestionsByExamId, getQuestionById, getQuestionsByOrganizationId, deleteQuestionById } = require('./controller/question');
const { decryptQuestionsIfThresholdMet } = require('./controller/submit-share');
const { createExam, submitShare, getExams } = require('./controller/exam');
const { calculateResults, submitAnswers } = require('./controller/answer');
const { getAllOrganizations, deleteOrganization } = require('./controller/organization');
const { createStudents } = require('./controller/student');


router.post('/api/v2/question/create', checkIfOrganization, createQuestion);
router.post('/api/v2/question/decrypt', checkIfOrganization, decryptQuestion);

//API : for shamira's secrets
router.post('/api/v2/secrets/submit-share', checkIfAuthenticated, checkIfOrganization, submitShare);
router.post('/api/v2/secrets/decrypt-questions', checkIfAuthenticated, checkIfOrganization, decryptQuestionsIfThresholdMet);

router.post('/create-exam', checkIfAdmin, createExam);
router.post('/api/v2/question/decrypt-all', checkIfOrganization, decryptAllQuestions);

//create students
router.post('/create-students', createStudents);

//get all exams
router.get('/exams', getExams);

// TODO: submit an answer in queue
router.post('/submit', submitAnswers);
// TODO: answer calculator in theory works as a gate for blockchain
router.post('/calculate-results', calculateResults);

// Route to get all organizations
router.get('/organizations', getAllOrganizations);

// Route to delete an organization by ID
router.delete('/organizations/:id', deleteOrganization);

// Getting questions
router.get('/questions', getAllQuestions);
router.get('/questions/:organizationId', getQuestionsByOrganizationId);
router.get('/questions/exam/:examId', getQuestionsByExamId);
router.get('/questions/:questionId', getQuestionById);
router.delete('/questions/:questionId', deleteQuestionById);

module.exports = router;
