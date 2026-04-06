// Product Controller - Full CRUD, search/filter/boost

const fs = require('fs/promises');
const path = require('path');

const Product = require('../schemas/Product');
const ProductReport = require('../schemas/ProductReport');
const Location = require('../schemas/Location');
const { protect } = require('../utils/jwt');
const { uploadImages, uploadProductImages } = require('../utils/upload');
const Image = require('../schemas/Image');
const mongoose = require('mongoose');

const PRODUCT_UPDATE_FIELDS = ['title', 'description', 'price', 'condition', 'category', 'subCategory', 'location', 'isSold'];
const PUBLIC_SELLER_FIELDS = 'name email phone avatar role location createdAt updatedAt';
const normalizeFilePath = (filePath) => String(filePath || '').replace(/\\/g, '/');
const isAdminRequest = (req) => (req.authRole || req.user?.role?.name || req.user?.role) === 'admin';
const buildPublicProductQuery = () => ({ isSold: false, status: 'approved', isHidden: false });
const MODERATION_RESET_FIELDS = ['title', 'description', 'price', 'condition', 'category', 'subCategory', 'location'];
const MAX_PRODUCT_IMAGES = 10;
const DEFAULT_COMPARE_LIMIT = 4;
const MAX_COMPARE_LIMIT = 8;
const REPORT_REASON_CODES = ['fraud', 'spam', 'wrong_category', 'prohibited_item', 'duplicate', 'sold_already', 'other'];
const REPORT_TEXT_LIMIT = 500;

const normalizeCompareLimit = (value) => {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_COMPARE_LIMIT;
  }

  return Math.min(parsed, MAX_COMPARE_LIMIT);
};

const buildCompareLocationMeta = (currentLocation, candidateLocation) => {
  const currentProvince = currentLocation?.province || '';
  const currentDistrict = currentLocation?.district || '';
  const candidateProvince = candidateLocation?.province || '';
  const candidateDistrict = candidateLocation?.district || '';

  return {
    sameProvince: Boolean(currentProvince && candidateProvince && currentProvince === candidateProvince),
    sameDistrict: Boolean(currentDistrict && candidateDistrict && currentDistrict === candidateDistrict)
  };
};

const buildCompareItem = (currentProduct, candidateProduct) => {
  const currentPrice = Number(currentProduct?.price) || 0;
  const candidatePrice = Number(candidateProduct?.price) || 0;
  const priceDifference = candidatePrice - currentPrice;
  const locationMeta = buildCompareLocationMeta(currentProduct?.location, candidateProduct?.location);
  const sameSubCategory = Boolean(
    currentProduct?.subCategory
    && candidateProduct?.subCategory
    && String(currentProduct.subCategory._id || currentProduct.subCategory) === String(candidateProduct.subCategory._id || candidateProduct.subCategory)
  );
  const sameCondition = String(currentProduct?.condition || '') === String(candidateProduct?.condition || '');

  return {
    product: candidateProduct,
    comparison: {
      priceDifference,
      sameCondition,
      sameSubCategory,
      sameProvince: locationMeta.sameProvince,
      sameDistrict: locationMeta.sameDistrict
    }
  };
};

const compareProductsBySimilarity = (left, right) => {
  const leftScore =
    (left.comparison.sameSubCategory ? 4 : 0)
    + (left.comparison.sameDistrict ? 3 : 0)
    + (left.comparison.sameProvince ? 2 : 0)
    + (left.comparison.sameCondition ? 1 : 0);
  const rightScore =
    (right.comparison.sameSubCategory ? 4 : 0)
    + (right.comparison.sameDistrict ? 3 : 0)
    + (right.comparison.sameProvince ? 2 : 0)
    + (right.comparison.sameCondition ? 1 : 0);

  if (leftScore !== rightScore) {
    return rightScore - leftScore;
  }

  const leftPriceGap = Math.abs(left.comparison.priceDifference);
  const rightPriceGap = Math.abs(right.comparison.priceDifference);
  if (leftPriceGap !== rightPriceGap) {
    return leftPriceGap - rightPriceGap;
  }

  return new Date(right.product?.createdAt || 0).getTime() - new Date(left.product?.createdAt || 0).getTime();
};

const clearModerationState = (updates) => {
  updates.status = 'pending';
  updates.isHidden = false;
  updates.approvedAt = null;
  updates.approvedBy = null;
  updates.rejectedAt = null;
  updates.rejectedBy = null;
  updates.rejectionReason = '';
  updates.hiddenAt = null;
  updates.hiddenBy = null;
  updates.hiddenReason = '';
};

const pickAllowedFields = (payload, allowedFields) => Object.fromEntries(
  Object.entries(payload || {}).filter(([key, value]) => allowedFields.includes(key) && value !== undefined)
);

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

const canAccessProductDetail = (product, req) => {
  const isOwner = String(product?.seller?._id || product?.seller) === String(req.user?.id);
  return isOwner || isAdminRequest(req) || (product?.status === 'approved' && !product?.isHidden);
};

// @desc Create product
// @route POST /api/products
exports.createProduct = [protect, uploadImages, async (req, res, next) => {
  try {
    const { title, description, price, condition, category, subCategory, location } = req.body;
    const files = req.files || [];
    const images = await createImageDocuments(files, null, req.user.id);

    const product = await Product.create({
      title, description, price, condition, category, subCategory, location,
      seller: req.user.id,
      status: 'pending',
      images: images.map(img => img._id)
    });

    if (images.length > 0) {
      await Image.updateMany(
        { _id: { $in: images.map((image) => image._id) } },
        { $set: { product: product._id } }
      );
    }

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
      .populate('category subCategory location images')
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
      .populate('category subCategory location images');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (!canAccessProductDetail(product, req)) {
      return res.status(404).json({ message: 'Product not found' });
    }
    product.views += 1;
    await product.save();
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get same-category products for comparison
// @route GET /api/products/:id/compare
exports.getProductComparisons = async (req, res, next) => {
  try {
    const limit = normalizeCompareLimit(req.query.limit);
    const currentProduct = await Product.findById(req.params.id)
      .populate('seller', PUBLIC_SELLER_FIELDS)
      .populate('category subCategory location images');

    if (!currentProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (!canAccessProductDetail(currentProduct, req)) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const query = {
      ...buildPublicProductQuery(),
      _id: { $ne: currentProduct._id },
      category: currentProduct.category?._id || currentProduct.category
    };

    const candidateProducts = await Product.find(query)
      .populate('seller', PUBLIC_SELLER_FIELDS)
      .populate('category subCategory location images');

    const compareItems = candidateProducts
      .map((candidateProduct) => buildCompareItem(currentProduct, candidateProduct))
      .sort(compareProductsBySimilarity)
      .slice(0, limit);

    res.json({
      success: true,
      data: {
        product: currentProduct,
        peers: compareItems,
        criteria: {
          category: currentProduct.category,
          subCategory: currentProduct.subCategory || null,
          location: currentProduct.location || null,
          condition: currentProduct.condition,
          limit
        }
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Report product
// @route POST /api/products/:id/report
exports.reportProduct = [protect, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Product id is invalid' });
    }

    const reasonText = String(req.body.reasonText || req.body.reason || '').trim();
    const reasonCode = REPORT_REASON_CODES.includes(String(req.body.reasonCode || '').trim())
      ? String(req.body.reasonCode).trim()
      : 'other';

    if (!reasonText) {
      return res.status(400).json({ message: 'Reason is required' });
    }

    if (reasonText.length > REPORT_TEXT_LIMIT) {
      return res.status(400).json({ message: `Reason must be at most ${REPORT_TEXT_LIMIT} characters` });
    }

    const product = await Product.findById(req.params.id)
      .populate('seller', PUBLIC_SELLER_FIELDS)
      .populate('category subCategory location images');

    if (!product || !canAccessProductDetail(product, req) || product.isSold) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (String(product.seller?._id || product.seller) === String(req.user.id)) {
      return res.status(400).json({ message: 'Cannot report your own product' });
    }

    const existingPendingReport = await ProductReport.findOne({
      product: product._id,
      reporter: req.user.id,
      status: 'pending'
    });

    if (existingPendingReport) {
      return res.status(400).json({ message: 'You already have a pending report for this product' });
    }

    const report = await ProductReport.create({
      product: product._id,
      reporter: req.user.id,
      seller: product.seller?._id || product.seller,
      reasonCode,
      reasonText,
      productSnapshot: {
        title: product.title,
        price: Number(product.price) || 0
      }
    });

    res.status(201).json({
      success: true,
      message: 'Báo cáo đã được gửi đến quản trị viên để xem xét.',
      data: report
    });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(400).json({ message: 'You already have a pending report for this product' });
    }

    if (err?.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }

    res.status(500).json({ message: err.message });
  }
}];

// @desc Get products of current seller
exports.getMyProducts = [protect, async (req, res, next) => {
  try {
    const products = await Product.find({ seller: req.user.id })
      .populate('seller', PUBLIC_SELLER_FIELDS)
      .populate('category subCategory location images')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}];

// @desc Update product (seller only)
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

    const shouldResetModeration = (existingProduct.status !== 'pending' || existingProduct.isHidden)
      && (Object.keys(updates).some((field) => MODERATION_RESET_FIELDS.includes(field)) || hasImageChanges);

    if (shouldResetModeration) {
      clearModerationState(updates);
    }

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, seller: req.user.id },
      updates,
      { new: true, runValidators: true }
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
    if (product.status !== 'approved' || product.isHidden || product.isSold) {
      return res.status(400).json({ message: 'Only public active products can be boosted' });
    }
    product.isBoosted = true;
    product.boostedUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await product.save();
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}];
