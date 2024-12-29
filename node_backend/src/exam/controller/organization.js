const { Organization } = require("../models/Organization");

// Get all organizations
const getAllOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find({});
    res.status(200).json(organizations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching organizations', error });
  }
};

// Delete an organization by ID
const deleteOrganization = async (req, res) => {
  const { id } = req.params;

  try {
    const organization = await Organization.findOneAndDelete({ id });

    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    res.status(200).json({ message: 'Organization deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting organization', error });
  }
};

module.exports = {
  getAllOrganizations,
  deleteOrganization,
};
