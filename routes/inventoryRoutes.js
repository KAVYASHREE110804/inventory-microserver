const express = require('express');
const router = express.Router();
const { addProduct, getProducts, updateStockLevel } = require('../controllers/inventoryController');
const { validateProduct, validateStockUpdate } = require('../middleware/validator');

router.post('/product', validateProduct, addProduct);
router.get('/products', getProducts);
router.put('/stock', validateStockUpdate, updateStockLevel);

module.exports = router;
