const express = require('express');
const router = express.Router();
const Category = require('../schemas/Category');

router.get('/', async (req, res) => {
    try {
        const data = await Category.find().sort({ name: 1 }).lean();
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) {
            return res.status(400).json({ success: false, message: 'Name is required' });
        }
        const newCategory = new Category({ name, description });
        await newCategory.save();
        res.status(201).json({ success: true, data: newCategory });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: 'Tên hoặc slug danh mục đã tồn tại (thử tên khác hoặc xóa bản ghi cũ trong DB).' });
        }
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;