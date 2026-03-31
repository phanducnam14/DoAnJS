// Product Controller - Full CRUD, search/filter/boost

const Product = require('../schemas/Product');
const Location = require('../schemas/Location');
const { protect, authorize } = require('../utils/jwt');
const { uploadImages } = require('../utils/upload');
const Image = require('../schemas/Image');

// @desc Create product
// @route POST /api/products
exports.createProduct = [protect, uploadImages, async (req, res, next) => {
  try {
    const { title, description, price, condition, category, subCategory, location } = req.body;
    const files = req.files || [];
    const images = files.map(file => new Image({ url: file.path, product: null, user: req.user.id }));
    if (images.length > 0) await Image.insertMany(images);

    const product = await Product.create({
      title, description, price, condition, category, subCategory, location,
      seller: req.user.id,
      images: images.map(img => img._id)
    });

    res.status(201).json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}];

// @desc Get all products (search/filter/paginate/boosted)
// @route GET /api/products
exports.getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const query = { isSold: false };
    if (req.query.category) query.category = req.query.category;
    if (req.query.location) query.location = req.query.location;
    if (req.query.province || req.query.district) {
      const locationQuery = {};
      if (req.query.province) locationQuery.province = req.query.province;
      if (req.query.district) locationQuery.district = req.query.district;

      const locationIds = await Location.find(locationQuery).distinct('_id');
      query.location = { $in: locationIds };
    }
    if (req.query.search) query.title = { $regex: req.query.search, $options: 'i' };
    if (req.query.boosted) query.isBoosted = true;

    const products = await Product.find(query)
      .populate('seller category location images')
      .sort({ isBoosted: -1, boostedUntil: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const count = await Product.countDocuments(query);

    res.json({
      success: true,
      data: { products, pagination: { page, limit, total: count, pages: Math.ceil(count / limit) } }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get single product
// @route GET /api/products/:id
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller category location images');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    product.views += 1;
    await product.save();
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Update product (seller only)
exports.updateProduct = [protect, async (req, res, next) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, seller: req.user.id },
      req.body,
      { new: true, runValidators: true }
    ).populate('category subCategory location');
    if (!product) return res.status(404).json({ message: 'Product not found or not owner' });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}];

// @desc Delete product (seller only)
exports.deleteProduct = [protect, async (req, res, next) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, seller: req.user.id });
    if (!product) return res.status(404).json({ message: 'Product not found or not owner' });
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}];

// @desc Boost product
exports.boostProduct = [protect, async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, seller: req.user.id });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    product.isBoosted = true;
    product.boostedUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await product.save();
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}];

