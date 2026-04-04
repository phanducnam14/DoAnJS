const express = require('express');
const router = express.Router();
const Location = require('../schemas/Location');

router.get('/', async (req, res) => {
    try {
        const data = await Location.find().sort({ province: 1, district: 1 }).lean();
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { province, district, ward } = req.body;
        if (!province) {
            return res.status(400).json({ success: false, message: 'Province is required' });
        }
        const newLocation = new Location({ province, district, ward });
        await newLocation.save();
        res.status(201).json({ success: true, data: newLocation });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;