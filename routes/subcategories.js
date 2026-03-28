const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const SubCategory = require('../schemas/SubCategory');
const Category = require('../schemas/Category');

router.get('/', async (req, res) => {
    try {
        const filter = {};
        if (req.query.category) filter.category = req.query.category;
        const data = await SubCategory.find(filter).sort({ name: 1 }).lean();
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, category } = req.body;
        if (!name || !category) {
            return res.status(400).json({ success: false, message: 'Name and category are required' });
        }
        if (!mongoose.isValidObjectId(category)) {
            return res.status(400).json({ success: false, message: 'category phải là Mongo ObjectId hợp lệ' });
        }
        const cat = await Category.findById(category);
        if (!cat) {
            return res.status(400).json({ success: false, message: 'Không tìm thấy category với id đã gửi' });
        }
        const newSubCategory = new SubCategory({ name, category });
        await newSubCategory.save();
        await Category.findByIdAndUpdate(category, { $addToSet: { subCategories: newSubCategory._id } });
        res.status(201).json({ success: true, data: newSubCategory });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, message: 'category không hợp lệ' });
        }
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;