const Category = require('../schemas/Category');
const Location = require('../schemas/Location');
require('../schemas/SubCategory');

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate('subCategories').sort({ name: 1 });
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getLocations = async (req, res) => {
  try {
    const locations = await Location.find().sort({ province: 1, district: 1 });
    res.json({ success: true, data: locations });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
