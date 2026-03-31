// Seed script - run npm run seed

const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('./config/database');

const Role = require('./schemas/Role');
const User = require('./schemas/User');
const Category = require('./schemas/Category');
const SubCategory = require('./schemas/SubCategory');
const Product = require('./schemas/Product');
const Location = require('./schemas/Location');

const categoryNames = [
  'Xe cộ',
  'Bất động sản',
  'Điện thoại',
  'Điện tử',
  'Máy tính',
  'Thời trang',
  'Đồ gia dụng',
  'Nội thất',
  'Mẹ và bé',
  'Việc làm',
  'Dịch vụ',
  'Thú cưng',
  'Thể thao',
  'Sách và văn phòng phẩm',
  'Đồ ăn và thực phẩm',
  'Làm đẹp và sức khỏe',
  'Giải trí và sưu tầm',
  'Nông nghiệp',
  'Công nghiệp và xây dựng',
  'Du lịch và khách sạn',
  'Giáo dục và khóa học',
  'Đồ cũ / second-hand',
  'Hàng miễn phí / cho tặng',
  'Khác'
];

const locationSeed = {
  'Hà Nội': [
    'Ba Đình',
    'Hoàn Kiếm',
    'Tây Hồ',
    'Long Biên',
    'Cầu Giấy',
    'Đống Đa',
    'Hai Bà Trưng',
    'Hoàng Mai',
    'Thanh Xuân',
    'Hà Đông',
    'Bắc Từ Liêm',
    'Nam Từ Liêm',
    'Sơn Tây',
    'Ba Vì',
    'Chương Mỹ',
    'Đan Phượng',
    'Đông Anh',
    'Gia Lâm',
    'Hoài Đức',
    'Mê Linh',
    'Mỹ Đức',
    'Phú Xuyên',
    'Phúc Thọ',
    'Quốc Oai',
    'Sóc Sơn',
    'Thạch Thất',
    'Thanh Oai',
    'Thanh Trì',
    'Thường Tín',
    'Ứng Hòa'
  ],
  'TP.HCM': [
    'Quận 1',
    'Quận 3',
    'Quận 4',
    'Quận 5',
    'Quận 6',
    'Quận 7',
    'Quận 8',
    'Quận 10',
    'Quận 11',
    'Quận 12',
    'Bình Tân',
    'Bình Thạnh',
    'Gò Vấp',
    'Phú Nhuận',
    'Tân Bình',
    'Tân Phú',
    'Thủ Đức',
    'Bình Chánh',
    'Cần Giờ',
    'Củ Chi',
    'Hóc Môn',
    'Nhà Bè'
  ]
};

const toSlug = (value) => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/đ/g, 'd')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const seedRoles = async () => {
  await Promise.all([
    Role.updateOne({ name: 'user' }, { name: 'user' }, { upsert: true }),
    Role.updateOne({ name: 'admin' }, { name: 'admin' }, { upsert: true })
  ]);
};

const seedUsers = async () => {
  const userRole = await Role.findOne({ name: 'user' });
  const adminRole = await Role.findOne({ name: 'admin' });

  const users = [
    { name: 'Test User', email: 'user@test.com', password: '123456', phone: '0123456789', role: userRole._id },
    { name: 'Admin', email: 'admin@test.com', password: '123456', phone: '0987654321', role: adminRole._id }
  ];

  for (const data of users) {
    const existingUser = await User.findOne({ email: data.email });

    if (!existingUser) {
      await User.create(data);
      continue;
    }

    existingUser.name = data.name;
    existingUser.phone = data.phone;
    existingUser.role = data.role;
    await existingUser.save();
  }
};

const seedCategories = async () => {
  await Promise.all(categoryNames.map((name) => Category.updateOne(
    { slug: toSlug(name) },
    {
      name,
      slug: toSlug(name),
      description: `Danh mục ${name}`
    },
    { upsert: true }
  )));
};

const seedSubCategories = async () => {
  const phoneCat = await Category.findOne({ slug: 'dien-thoai' });
  const laptopCat = await Category.findOne({ slug: 'laptop' });
  const subIphone = await SubCategory.create({ name: 'iPhone', category: phoneCat._id });
  const subAndroid = await SubCategory.create({ name: 'Android', category: phoneCat._id });
  const subMac = await SubCategory.create({ name: 'MacBook', category: laptopCat._id });
  await Category.findByIdAndUpdate(phoneCat._id, { $addToSet: { subCategories: { $each: [subIphone._id, subAndroid._id] } } });
  await Category.findByIdAndUpdate(laptopCat._id, { $addToSet: { subCategories: subMac._id } });
};

const seedLocations = async () => {
  const operations = Object.entries(locationSeed).flatMap(([province, districts]) => (
    districts.map((district) => Location.updateOne(
      { province, district },
      { province, district },
      { upsert: true }
    ))
  ));

  await Promise.all(operations);
};

const seedProducts = async () => {
  const seller = await User.findOne({ email: 'user@test.com' });
  const category = await Category.findOne({ slug: 'dien-thoai' });
<<<<<<< HEAD
  const subCategory = await SubCategory.findOne({ slug: 'iphone' });
  const location = await Location.findOne({ province: 'Hà Nội' });

  await Product.create({
    title: 'iPhone 15 Pro Max like new',
    description: 'Bán iPhone 15 Pro Max 256GB màu đen, 99%',
    price: 25000000,
    condition: 'like_new',
    category: category._id,
    subCategory: subCategory._id,
    location: location._id,
    seller: seller._id
  });
=======
  const location = await Location.findOne({ province: 'Hà Nội', district: 'Ba Đình' });

  await Product.updateOne(
    { title: 'iPhone 15 Pro Max like new', seller: seller._id },
    {
      title: 'iPhone 15 Pro Max like new',
      description: 'Bán iPhone 15 Pro Max 256GB màu đen, 99%',
      price: 25000000,
      condition: 'like_new',
      category: category._id,
      location: location._id,
      seller: seller._id
    },
    { upsert: true }
  );
>>>>>>> 24799fc (Add frontend & fix cate)
};

const seedData = async () => {
  await seedRoles();
  await seedUsers();
  await seedCategories();
  await seedSubCategories();
  await seedLocations();
  await seedProducts();
  console.log('Seed complete!');
};

const main = async () => {
  try {
    await connectDB();
    await seedData();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

main();

