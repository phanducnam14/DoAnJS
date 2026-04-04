const express = require('express');
const { getCategories, getLocations } = require('../controllers/metaController');

const router = express.Router();

router.get('/categories', getCategories);
router.get('/locations', getLocations);

module.exports = router;
