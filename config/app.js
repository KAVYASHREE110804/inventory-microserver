const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const rateLimiter = require('../middleware/rateLimiter');
const errorMiddleware = require('../middleware/errorMiddleware');
const inventoryRoutes = require('../routes/inventoryRoutes');
const alertRoutes = require('../routes/alertRoutes');

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(rateLimiter);

app.use('/api', inventoryRoutes);
app.use('/api', alertRoutes);

app.use(errorMiddleware);

module.exports = app;
