// Product Controller - Full CRUD, search/filter/boost

<<<<<<< HEAD
const Product = require('../schemas/Product');
const Location = require('../schemas/Location');
const { protect, authorize } = require('../utils/jwt');
const { uploadImages } = require('../utils/upload');
=======
const fs = require('fs/promises');
const path = require('path');

const Product = require('../schemas/Product');
const Location = require('../schemas/Location');
const { protect } = require('../utils/jwt');
const { uploadImages, uploadProductImages } = require('../utils/upload');
>>>>>>> f380d9a (edit picture/duyet)
const Image = require('../schemas/Image');

const PRODUCT_UPDATE_FIELDS = ['title', 'description', 'price', 'condition', 'category', 'subCategory', 'location', 'isSold'];
const PUBLIC_SELLER_FIELDS = 'name email phone avatar role location createdAt updatedAt';
const normalizeFilePath = (filePath) => String(filePath || '').replace(/\\/g, '/');
const isAdminRequest = (req) => (req.authRole || req.user?.role?.name || req.user?.role) === 'admin';
const buildPublicProductQuery = () => ({ isSold: false, status: 'approved', isHidden: false });
const MODERATION_RESET_FIELDS = ['title', 'description', 'price', 'condition', 'category', 'subCategory', 'location'];
<<<<<<< HEAD
=======
const MAX_PRODUCT_IMAGES = 10;
>>>>>>> f380d9a (edit picture/duyet)

const pickAllowedFields = (payload, allowedFields) => Object.fromEntries(
  Object.entries(payload || {}).filter(([key, value]) => allowedFields.includes(key) && value !== undefined)
);

<<<<<<< HEAD
=======
const parseStringArray = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item || '').trim()).filter(Boolean);
  }

  if (value === undefined || value === null || value === '') {
    return [];
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return [];

    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        return parseStringArray(parsed);
      } catch (error) {
        return [trimmed];
      }
    }

    return [trimmed];
  }

  return [String(value).trim()].filter(Boolean);
};

const createImageDocuments = async (files, productId, userId) => {
  const normalizedFiles = Array.isArray(files) ? files : [];
  if (normalizedFiles.length === 0) return [];

  return Image.insertMany(
    normalizedFiles.map((file) => ({
      url: normalizeFilePath(file.path),
      product: productId || null,
      user: userId
    }))
  );
};

const removeImageFiles = async (images) => {
  const fileJobs = (images || [])
    .map((image) => normalizeFilePath(image?.url))
    .filter(Boolean)
    .map((relativePath) => fs.unlink(path.join(__dirname, '..', relativePath)));

  if (fileJobs.length === 0) return;
  await Promise.allSettled(fileJobs);
};

const deleteImageDocuments = async (images) => {
  const ids = (images || []).map((image) => String(image?._id || '')).filter(Boolean);
  if (ids.length === 0) return;

  await Image.deleteMany({ _id: { $in: ids } });
  await removeImageFiles(images);
};

>>>>>>> f380d9a (edit picture/duyet)
// @desc Create product
// @route POST /api/products
exports.createProduct = [protect, uploadImages, async (req, res, next) => {
  try {
    const { title, description, price, condition, category, subCategory, location } = req.body;
    const files = req.files || [];
<<<<<<< HEAD
    const images = files.map(file => new Image({ url: normalizeFilePath(file.path), product: null, user: req.user.id }));
    if (images.length > 0) await Image.insertMany(images);
=======
    const images = await createImageDocuments(files, null, req.user.id);
>>>>>>> f380d9a (edit picture/duyet)

    const product = await Product.create({
      title, description, price, condition, category, subCategory, location,
      seller: req.user.id,
      status: 'pending',
      images: images.map(img => img._id)
    });

<<<<<<< HEAD
=======
    if (images.length > 0) {
      await Image.updateMany(
        { _id: { $in: images.map((image) => image._id) } },
        { $set: { product: product._id } }
      );
    }

>>>>>>> f380d9a (edit picture/duyet)
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

    const query = buildPublicProductQuery();
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
      .populate('seller', PUBLIC_SELLER_FIELDS)
      .populate('category location images')
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
    const product = await Product.findById(req.params.id)
      .populate('seller', PUBLIC_SELLER_FIELDS)
      .populate('category location images');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const isOwner = String(product.seller?._id || product.seller) === String(req.user?.id);
    if ((product.status !== 'approved' || product.isHidden) && !isOwner && !isAdminRequest(req)) {
      return res.status(404).json({ message: 'Product not found' });
    }
    product.views += 1;
    await product.save();
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get products of current seller
exports.getMyProducts = [protect, async (req, res, next) => {
  try {
    const products = await Product.find({ seller: req.user.id })
      .populate('seller', PUBLIC_SELLER_FIELDS)
      .populate('category location images')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}];

// @desc Update product (seller only)
<<<<<<< HEAD
exports.updateProduct = [protect, async (req, res, next) => {
  try {
    const updates = pickAllowedFields(req.body, PRODUCT_UPDATE_FIELDS);
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No valid product fields provided' });
    }

    const existingProduct = await Product.findOne({ _id: req.params.id, seller: req.user.id });
    if (!existingProduct) return res.status(404).json({ message: 'Product not found or not owner' });

    const shouldResetModeration = existingProduct.status === 'approved'
      && Object.keys(updates).some((field) => MODERATION_RESET_FIELDS.includes(field));
=======
exports.updateProduct = [protect, uploadProductImages, async (req, res, next) => {
  let createdImages = [];
  try {
    const updates = pickAllowedFields(req.body, PRODUCT_UPDATE_FIELDS);
    const uploadedImages = req.files?.images || [];
    const replacementFiles = req.files?.replaceImages || [];
    const removeImageIds = [...new Set(parseStringArray(req.body.removeImageIds))];
    const replaceImageIds = [...new Set(parseStringArray(req.body.replaceImageIds))];
    const hasImageChanges = uploadedImages.length > 0 || removeImageIds.length > 0 || replaceImageIds.length > 0;

    if (Object.keys(updates).length === 0 && !hasImageChanges) {
      return res.status(400).json({ message: 'No valid product fields provided' });
    }

    if (replacementFiles.length !== replaceImageIds.length) {
      return res.status(400).json({ message: 'Replacement images are invalid' });
    }

    const replacementOverlap = replaceImageIds.some((id) => removeImageIds.includes(id));
    if (replacementOverlap) {
      return res.status(400).json({ message: 'Cannot remove and replace the same image in one request' });
    }

    const existingProduct = await Product.findOne({ _id: req.params.id, seller: req.user.id }).populate('images');
    if (!existingProduct) return res.status(404).json({ message: 'Product not found or not owner' });

    const currentImageIds = (existingProduct.images || []).map((image) => String(image?._id || image));
    const requestedManagedIds = [...removeImageIds, ...replaceImageIds];
    const unknownImageId = requestedManagedIds.find((id) => !currentImageIds.includes(id));

    if (unknownImageId) {
      return res.status(400).json({ message: 'One or more selected images do not belong to this product' });
    }

    const projectedImageCount = currentImageIds.length - removeImageIds.length + uploadedImages.length;
    if (projectedImageCount > MAX_PRODUCT_IMAGES) {
      return res.status(400).json({ message: `A product can have at most ${MAX_PRODUCT_IMAGES} images` });
    }

    createdImages = await createImageDocuments(
      [...replacementFiles, ...uploadedImages],
      existingProduct._id,
      req.user.id
    );

    const replacementImages = createdImages.slice(0, replacementFiles.length);
    const addedImages = createdImages.slice(replacementFiles.length);
    const replacementMap = new Map(
      replaceImageIds.map((imageId, index) => [imageId, String(replacementImages[index]._id)])
    );
    const removeSet = new Set(removeImageIds);
    const nextImageIds = currentImageIds.flatMap((imageId) => {
      if (removeSet.has(imageId)) return [];
      if (replacementMap.has(imageId)) return [replacementMap.get(imageId)];
      return [imageId];
    });

    nextImageIds.push(...addedImages.map((image) => String(image._id)));

    if (hasImageChanges) {
      updates.images = nextImageIds;
    }

    const shouldResetModeration = existingProduct.status === 'approved'
      && (Object.keys(updates).some((field) => MODERATION_RESET_FIELDS.includes(field)) || hasImageChanges);
>>>>>>> f380d9a (edit picture/duyet)

    if (shouldResetModeration) {
      updates.status = 'pending';
      updates.approvedAt = null;
      updates.approvedBy = null;
      updates.isHidden = false;
    }

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, seller: req.user.id },
      updates,
      { new: true, runValidators: true }
<<<<<<< HEAD
    ).populate('category subCategory location');
    if (!product) return res.status(404).json({ message: 'Product not found or not owner' });
    res.json({ success: true, data: product });
  } catch (err) {
=======
    )
      .populate('seller', PUBLIC_SELLER_FIELDS)
      .populate('category subCategory location images');
    if (!product) return res.status(404).json({ message: 'Product not found or not owner' });

    const staleImages = (existingProduct.images || []).filter((image) => removeSet.has(String(image._id)) || replacementMap.has(String(image._id)));
    await deleteImageDocuments(staleImages);

    res.json({ success: true, data: product });
  } catch (err) {
    if (createdImages.length > 0) {
      await deleteImageDocuments(createdImages);
    }
>>>>>>> f380d9a (edit picture/duyet)
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
<<<<<<< HEAD

=======
>>>>>>> f380d9a (edit picture/duyet)
