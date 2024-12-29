const mongoose = require('../../../services/mongoose');

const Organization = mongoose.model(
  'Organization',
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    share: {
      type: String,
      // required: true,
    },
  },
  'organizations',
);

module.exports = {
  Organization,
};
