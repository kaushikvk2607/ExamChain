require('dotenv').config();

const config = {
  port: 5000,
  dbUrlMongoDB: process.env.dbUrlMongoDB,
  API_KEY_JWT: process.env.API_KEY_JWT,
  TOKEN_EXPIRES_IN: process.env.TOKEN_EXPIRES_IN,
  PRIVATE_KEY_SECRET: process.env.PRIVATE_KEY_SECRET,
};

module.exports = config;
