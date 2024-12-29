const sss = require('shamirs-secret-sharing');
const { Organization } = require('../models/Organization');


const createOrganizationsWithShares = async () => {
  const secret = 'examchainencryptionkey';
  const totalShares = 5;
  const threshold = 3;

  const shares = sss.split(Buffer.from(secret), { shares: totalShares, threshold });

  const organizationsData = [
    { name: 'Organization 1', share: shares[0].toString('hex') },
    { name: 'Organization 2', share: shares[1].toString('hex') },
    { name: 'Organization 3', share: shares[2].toString('hex') },
    { name: 'Organization 4', share: shares[3].toString('hex') },
    { name: 'Organization 5', share: shares[4].toString('hex') },
  ];

  for (const orgData of organizationsData) {
    const newOrg = new Organization(orgData);
    await newOrg.save();
  }

  console.log('Organizations created with secret shares');
};

module.exports = {
    createOrganizationsWithShares
}
