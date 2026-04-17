const store = require('../data/store');
const { generateId } = require('../utils/uuid');
const { checkThresholdAndAlert } = require('./alertService');

const addOrUpdateProduct = async ({ productId, productName, quantity, thresholdLevel }) => {
  const existing = store.products.find((p) => p.productId === productId);

  if (existing) {
    existing.productName = productName;
    existing.quantity = quantity;
    existing.thresholdLevel = thresholdLevel;
    await checkThresholdAndAlert(existing);
    return { product: existing, created: false };
  }

  const product = {
    productId: productId || generateId(),
    productName,
    quantity,
    thresholdLevel,
  };

  store.products.push(product);
  await checkThresholdAndAlert(product);
  return { product, created: true };
};

const getAllProducts = async () => store.products;

const updateStock = async (productId, quantity) => {
  const product = store.products.find((p) => p.productId === productId);
  if (!product) return null;

  product.quantity = quantity;
  await checkThresholdAndAlert(product);
  return product;
};

module.exports = { addOrUpdateProduct, getAllProducts, updateStock };
