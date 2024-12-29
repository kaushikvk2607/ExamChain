const mongoose = require('mongoose');

const User = mongoose.model(
  'User',
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    name: String,
    lastName: String,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['ORGANIZATION', 'ADMIN', 'STUDENT'],
    },
    password: {
      type: String,
      required: true,
    },
  },
  'users'
);

module.exports = {
  User,
};
