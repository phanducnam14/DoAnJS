const express = require('express');
const { toggleFavorite, getFavorites } = require('../controllers/favoriteController');
const { protect } = require('../utils/jwt');

const router = express.Router();

router.use(protect);
router.post('/:productId', toggleFavorite);
router.get('/', getFavorites);

module.exports = router;

