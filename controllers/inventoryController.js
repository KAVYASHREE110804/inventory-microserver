const { addOrUpdateProduct, getAllProducts, updateStock } = require('../services/inventoryService');

const addProduct = async (req, res, next) => {
  try {
    const { productId, productName, quantity, thresholdLevel } = req.body;
    const { product, created } = await addOrUpdateProduct({ productId, productName, quantity, thresholdLevel });
    res.status(created ? 201 : 200).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

const getProducts = async (req, res, next) => {
  try {
    const products = await getAllProducts();
    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (err) {
    next(err);
  }
};

const updateStockLevel = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const product = await updateStock(productId, quantity);
    if (!product) {
      return res.status(404).json({ success: false, error: `Product with id "${productId}" not found.` });
    }
    res.status(200).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

module.exports = { addProduct, getProducts, updateStockLevel };
