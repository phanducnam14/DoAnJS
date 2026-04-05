const express = require('express');

const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../utils/jwt');

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/dashboard', adminController.getDashboard);
router.get('/users', adminController.getUsers);
router.put('/users/:id/role', adminController.updateUserRole);
router.put('/users/:id/ban', adminController.updateUserBan);
router.delete('/users/:id', adminController.deleteUser);
router.get('/products', adminController.getProducts);
router.put('/products/:id/approve', adminController.approveProduct);
router.put('/products/:id/reject', adminController.rejectProduct);
router.put('/products/:id/hide', adminController.hideProduct);
router.put('/products/:id/unhide', adminController.unhideProduct);
router.delete('/products/:id', adminController.deleteProduct);
router.get('/activities', adminController.getActivities);

module.exports = router;
