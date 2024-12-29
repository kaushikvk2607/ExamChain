const Bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../../../config');
const schemes = require('../models/mongoose');
const { Student } = require('../../exam/models/Student');
const { Organization } = require('../../exam/models/Organization');

const generateKeyPair = () => {
  return crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  });
};

const encryptPrivateKey = (privateKey, secret) => {
  const cipher = crypto.createCipheriv('aes-256-cbc', secret);
  let encrypted = cipher.update(privateKey, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

const signUp = async (res, parameters) => {
  const {
    password,
    passwordConfirmation,
    email,
    username,
    name,
    lastName,
    role,
    enrollmentNumber, // specific to student
    examId, // specific to student
    id, // specific to organization
    share, // specific to organization
  } = parameters;

  if (password === passwordConfirmation) {
    const newUser = schemes.User({
      password: Bcrypt.hashSync(password, 10),
      email,
      username,
      name,
      lastName,
      role,
    });

    try {
      const savedUser = await newUser.save();

      if (role === 'STUDENT') {
        // const { publicKey, privateKey } = generateKeyPair();
        // const encryptedPrivateKey = encryptPrivateKey(privateKey, config.PRIVATE_KEY_SECRET);

        const newStudent = new Student({
          enrollmentNumber,
          name,
          examId
        });
        await newStudent.save();
      } else if (role === 'ORGANIZATION') {
        const newOrganization = new Organization({
          id,
          name,
        });
        await newOrganization.save();
      }

      const token = jwt.sign(
        { email, id: savedUser.id, username ,role:savedUser.role},
        config.API_KEY_JWT,
        { expiresIn: config.TOKEN_EXPIRES_IN }
      );

      return res.status(201).json({ token });
    } catch (error) {
      return res.status(400).json({
        status: 400,
        message: error.message,
      });
    }
  }

  return res.status(400).json({
    status: 400,
    message: 'Passwords are different, try again!!!',
  });
};

const userDetails = async (res, parameters) => {
  const { userId } = parameters;

  try {
    // Fetch user details based on userId
    const user = await schemes.User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: 'User not found',
      });
    }

    // Return user details
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Internal server error',
    });
  }
};

const login = async (res, parameters) => {
  const { emailOrUsername, password } = parameters;

  try {
    // Check if the user exists by email or username
    const user = await schemes.User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
    });

    if (!user) {
      return res.status(400).json({
        status: 400,
        message: 'User not found',
      });
    }

    // Verify the password
    const passwordMatch = await Bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({
        status: 400,
        message: 'Invalid password',
      });
    }

    // Generate and return a JWT token
    const token = jwt.sign(
      { email: user.email, id: user.id, username: user.username , role: user.role},
      config.API_KEY_JWT,
      { expiresIn: config.TOKEN_EXPIRES_IN }
    );

    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Internal server error',
    });
  }
};

const getStudentDetails = async (username) => {
  try {
    // Assuming you have a relationship between User and Student models
    const student = await Student.findOne({ username }).populate('examId');

    if (!student) {
      throw new Error('Student not found');
    }

    return student;
  } catch (error) {
    throw new Error(`Error fetching student details: ${error.message}`);
  }
};


module.exports = {
  signUp,
  login,
  userDetails,
  getStudentDetails
};
