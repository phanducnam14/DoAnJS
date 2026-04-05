const express = require('express');
const { getCategories, getLocations, getUnreadNotifications } = require('../controllers/metaController');
const { protect } = require('../utils/jwt');

const router = express.Router();

router.get('/categories', getCategories);
router.get('/locations', getLocations);
router.get('/unread-notifications', protect, getUnreadNotifications);

module.exports = router;
