const express = require('express');
const { createProduct, getProducts, getMyProducts, getProduct, updateProduct, deleteProduct, boostProduct } = require('../controllers/productController');

const router = express.Router();

router.post('/', createProduct);
router.get('/', getProducts);
router.get('/mine', getMyProducts);
router.get('/:id', getProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.put('/:id/boost', boostProduct);

module.exports = router;

