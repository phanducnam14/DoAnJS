const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('morgan');
require('dotenv').config();
const connectDB = require('./config/database');

// Connect DB
connectDB();

const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');

const app = express();

app.use(helmet());
app.use(cors());
app.use(logger('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/products', require('./routes/products'));

app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

module.exports = app;
