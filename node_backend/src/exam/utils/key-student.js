// Assuming you are using Node.js environment

const crypto = require('crypto');

// Generate a key pair for the student
function generateKeyPair() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  });
  return { publicKey, privateKey };
}

// Sign a message
function signMessage(privateKey, message) {
  const sign = crypto.createSign('SHA256');
  sign.update(message);
  sign.end();
  const signature = sign.sign(privateKey, 'base64');
  return signature;
}

// Example usage
const { publicKey, privateKey } = generateKeyPair();
const message = JSON.stringify({
  questionId: '60d5ec59f3a4c427b4f8e4b8',
  answer: '4',
  enrollmentNumber: 'EN001'
});
const signature = signMessage(privateKey, message);

// Send to server
const submission = {
  message,
  signature,
  publicKey
};

console.log(submission);
