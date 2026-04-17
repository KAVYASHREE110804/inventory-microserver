const { body, validationResult } = require('express-validator');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

const validateProduct = [
  body('productName').trim().notEmpty().withMessage('productName is required'),
  body('quantity').isInt({ min: 0 }).withMessage('quantity must be a non-negative integer'),
  body('thresholdLevel').isInt({ min: 1 }).withMessage('thresholdLevel must be a positive integer'),
  handleValidation,
];

const validateStockUpdate = [
  body('productId').trim().notEmpty().withMessage('productId is required'),
  body('quantity').isInt({ min: 0 }).withMessage('quantity must be a non-negative integer'),
  handleValidation,
];

module.exports = { validateProduct, validateStockUpdate };
