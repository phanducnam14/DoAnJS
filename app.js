const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('morgan');
require('dotenv').config();

const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const categoriesRouter = require('./routes/categories');
const subcategoriesRouter = require('./routes/subcategories');
const locationsRouter = require('./routes/locations');
const favoritesRouter = require('./routes/favorites');
const metaRouter = require('./routes/meta');

const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(logger('dev'));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  // Keep a DB-free endpoint for smoke tests and runtime checks.
  app.get('/api/health', (req, res) => {
    res.json({ success: true, data: { status: 'ok' } });
  });

  app.use('/api/auth', authRouter);
  app.use('/api/users', usersRouter);
  app.use('/api/products', require('./routes/products'));
  app.use('/api/categories', categoriesRouter);
  app.use('/api/subcategories', subcategoriesRouter);
  app.use('/api/locations', locationsRouter);
  app.use('/api/favorites', favoritesRouter);
  app.use('/api/meta', metaRouter);

  app.use((req, res, next) => {
    res.status(404).json({ message: 'Not Found' });
  });

  app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      return res.status(400).json({ message: 'Invalid JSON payload' });
    }

    res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
  });

  return app;
};

module.exports = createApp;