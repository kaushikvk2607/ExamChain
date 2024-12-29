const express = require('express');
const jwt = require('jsonwebtoken');
const controller = require('./controller/index');
const validateSchemas = require('../../middlewares/validateSchemas');
const schemas = require('./utils/schemasValidation');
const validateAuth = require('../../middlewares/validateAuth');
const { Student } = require('../exam/models/Student');
const config = require('../../config');

const router = express.Router();

router.post(
  '/api/v1/signup',
  (req, res) => {
    controller.signUp(res, req.body);
  }
);

router.post(
  '/api/v1/login',
  (req, res) => {
    controller.login(res, req.body);
  }
);

// API : User Details router
router.get(
  '/api/v1/user/details',
  validateAuth.checkIfAuthenticated,
  (req, res) => {
    // Use req.user to access the authenticated user's information
    res.json({ user: req.user });
  }
);

router.post(
  '/api/v1/save-public-key',
  validateAuth.checkIfAuthenticated,
  async (req, res) => {
    const { enrollmentNumber, publicKey } = req.body;

    try {
      // Ensure enrollmentNumber is present in the request body
      if (!enrollmentNumber) {
        return res.status(400).json({ message: 'Enrollment number is required' });
      }

      // Find the student using enrollmentNumber and update publicKey
      const student = await Student.findOneAndUpdate(
        { enrollmentNumber },
        { $set: { publicKey } },
        { new: true } // To return the updated document
      );

      // Check if student exists
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }

      // Logging for verification
      console.log('Enrollment Number:', enrollmentNumber);
      console.log('Public Key:', publicKey);

      res.status(200).json({ message: 'Public key saved successfully', student });
    } catch (error) {
      console.error('Error saving public key:', error);
      res.status(500).json({ message: 'Failed to save public key', error: error.message });
    }
  }
);

router.get('/api/v1/student-details/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const student = await controller.getStudentDetails(username);
    res.status(200).json(student);
  } catch (error) {
    console.error('Error:', error);
    res.status(404).json({ message: error.message });
  }
});

module.exports = router;
