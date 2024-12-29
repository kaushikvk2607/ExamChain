


//TODO: submit answer and ansure encryption with student details and public key


//TODO: submitting question is also encrypted from organization


//TODO: Function to make all questions live upon the shamira secret that is like there is a time window for the live of questions

//TODO: 

const submitAnswer = async (studentId, questionId, answer, privateKey) => {
  const student = await Student.findById(studentId);
  const signature = ethers.utils.signMessage(answer, privateKey);

  const answerEntry = new Answer({
    questionId,
    studentId,
    answer,
    signature,
    timestamp: new Date(),
  });

  await answerEntry.save();
};

const verifyAnswer = async (answerId) => {
  const answerEntry = await Answer.findById(answerId).populate('studentId');
  const student = answerEntry.studentId;

  const isValid = ethers.utils.verifyMessage(answerEntry.answer, answerEntry.signature) === student.publicKey;
  return isValid;
};


const submitToLedger = async (answerId) => {
  const answerEntry = await Answer.findById(answerId).populate('studentId questionId');
  const student = answerEntry.studentId;
  const question = answerEntry.questionId;

  const record = {
    studentId: student.enrollmentNumber,
    question: question.content,
    answer: answerEntry.answer,
    signature: answerEntry.signature,
    timestamp: answerEntry.timestamp,
  };

  // Store this record on a blockchain or a distributed ledger
  // For simplicity, assume a function `storeOnLedger(record)` that does this
  await storeOnLedger(record);
};

const storeOnLedger = async (record) => {
  // Implementation depends on the chosen blockchain or distributed ledger
  console.log('Record stored on ledger:', record);
};


const mongoose = require('../../../services/mongoose');
const { Student } = require('../models/Student');

const createStudents = async (req, res) => {
  try {
    const examId = mongoose.Types.ObjectId('66895ac003baad116037ecfe');
    const studentsData = [
      { enrollmentNumber: 'ENR001', name: 'John Doe', birthdate: '2000-01-01' },
      { enrollmentNumber: 'ENR002', name: 'Jane Smith', birthdate: '2000-02-01' },
      { enrollmentNumber: 'ENR003', name: 'Mike Johnson', birthdate: '2000-03-01' },
      { enrollmentNumber: 'ENR004', name: 'Emily Davis', birthdate: '2000-04-01' },
      { enrollmentNumber: 'ENR005', name: 'Chris Brown', birthdate: '2000-05-01' },
      { enrollmentNumber: 'ENR006', name: 'Sara Wilson', birthdate: '2000-06-01' },
      { enrollmentNumber: 'ENR007', name: 'David Lee', birthdate: '2000-07-01' },
      { enrollmentNumber: 'ENR008', name: 'Linda Harris', birthdate: '2000-08-01' },
      { enrollmentNumber: 'ENR009', name: 'James Clark', birthdate: '2000-09-01' },
      { enrollmentNumber: 'ENR010', name: 'Barbara Allen', birthdate: '2000-10-01' }
    ];

    const students = studentsData.map(data => {
      return new User({
        enrollmentNumber: data.enrollmentNumber,
        name: data.name,
        password: data.birthdate, // Store birthdate as password
        examId
      });
    });

    await Student.insertMany(students);

    res.status(201).json({ message: "Students created successfully" });
  } catch (error) {
    console.error('Error creating students:', error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

module.exports = {
  createStudents,
};
