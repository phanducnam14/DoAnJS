const express = require('express');
const { createProduct, getProducts, getMyProducts, getProduct, getProductComparisons, updateProduct, deleteProduct, boostProduct, reportProduct } = require('../controllers/productController');
const { optionalProtect } = require('../utils/jwt');

const router = express.Router();

router.post('/', createProduct);
router.get('/', getProducts);
router.get('/mine', getMyProducts);
router.get('/:id/compare', optionalProtect, getProductComparisons);
router.post('/:id/report', reportProduct);
router.get('/:id', optionalProtect, getProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.put('/:id/boost', boostProduct);

module.exports = router;

