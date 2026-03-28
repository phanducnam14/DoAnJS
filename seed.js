// Seed script - run npm run seed

const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('./config/database');

const Role = require('./schemas/Role');
const User = require('./schemas/User');
const Category = require('./schemas/Category');
const Product = require('./schemas/Product');
const Location = require('./schemas/Location');

connectDB();

const seedRoles = async () => {
  await Role.create([{ name: 'user' }, { name: 'admin' }]);
};

const seedUsers = async () => {
  const userRole = await Role.findOne({ name: 'user' });
  const adminRole = await Role.findOne({ name: 'admin' });
  await User.create([
    { name: 'Test User', email: 'user@test.com', password: '123456', phone: '0123456789', role: userRole._id },
    { name: 'Admin', email: 'admin@test.com', password: '123456', phone: '0987654321', role: adminRole._id }
  ]);
};

const seedCategories = async () => {
  await Category.create([
    { name: 'Điện thoại', slug: 'dien-thoai', description: 'Điện thoại di động' },
    { name: 'Laptop', slug: 'laptop', description: 'Máy tính xách tay' }
  ]);
};

const seedLocations = async () => {
  await Location.create([
    { province: 'Hà Nội', district: 'Ba Đình' },
    { province: 'TP.HCM', district: 'Quận 1' }
  ]);
};

const seedProducts = async () => {
  const seller = await User.findOne({ email: 'user@test.com' });
  const category = await Category.findOne({ slug: 'dien-thoai' });
  const location = await Location.findOne({ province: 'Hà Nội' });

  await Product.create({
    title: 'iPhone 15 Pro Max like new',
    description: 'Bán iPhone 15 Pro Max 256GB màu đen, 99%',
    price: 25000000,
    condition: 'like_new',
    category: category._id,
    location: location._id,
    seller: seller._id
  });
};

const seedData = async () => {
  await seedRoles();
  await seedUsers();
  await seedCategories();
  await seedLocations();
  await seedProducts();
  console.log('Seed complete!');
  process.exit();
};

seedData().catch(err => {
  console.error(err);
  process.exit(1);
});

