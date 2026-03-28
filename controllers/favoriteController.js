const Favorite = require('../schemas/Favorite');
const Product = require('../schemas/Product');
const { protect } = require('../utils/jwt');

// @desc Toggle favorite product
// @route POST /api/favorites/:productId
exports.toggleFavorite = async (req, res, next) => {
  try {
    const favorite = await Favorite.findOne({ user: req.user.id, product: req.params.productId });
    if (favorite) {
      await Favorite.findByIdAndDelete(favorite._id);
      await Product.findByIdAndUpdate(req.params.productId, { $inc: { favoritesCount: -1 } });
      return res.json({ success: true, message: 'Removed from favorites' });
    }
    await Favorite.create({ user: req.user.id, product: req.params.productId });
    await Product.findByIdAndUpdate(req.params.productId, { $inc: { favoritesCount: 1 } });
    res.status(201).json({ success: true, message: 'Added to favorites' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get user favorites
// @route GET /api/favorites
exports.getFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ user: req.user.id }).populate('product');
    res.json({ success: true, data: favorites });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

