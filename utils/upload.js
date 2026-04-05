const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads dir
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Not an image'), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

const uploadImages = upload.array('images', 10); // max 10 images
<<<<<<< HEAD

module.exports = { uploadImages };

=======
const uploadProductImages = upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'replaceImages', maxCount: 10 }
]);

module.exports = { uploadImages, uploadProductImages };
>>>>>>> f380d9a (edit picture/duyet)
