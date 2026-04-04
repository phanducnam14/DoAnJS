const express = require('express');
const { getMe, updateProfile, uploadAvatar } = require('../controllers/userController');
const { protect } = require('../utils/jwt');
const { uploadImages } = require('../utils/upload');

const router = express.Router();

router.use(protect);
router.get('/me', getMe);
router.put('/profile', updateProfile);
router.put('/avatar', uploadImages, uploadAvatar);

module.exports = router;

