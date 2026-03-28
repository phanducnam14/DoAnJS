const express = require('express');
const path = require('path');
const logger = require('morgan');

const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');

const app = express();

// TODO: Kết nối database ở đây
// const db = require('./config/database');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);

app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

module.exports = app;
