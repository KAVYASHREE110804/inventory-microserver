const store = require('../data/store');
const { generateId } = require('../utils/uuid');

const mockSendEmail = (alert) => {
  console.log(`[ALERT EMAIL] To: admin@inventory.com | Product: ${alert.productId} | ${alert.message}`);
};

const checkThresholdAndAlert = async (product) => {
  if (product.quantity < product.thresholdLevel) {
    const alert = {
      id: generateId(),
      productId: product.productId,
      productName: product.productName,
      message: `Low stock alert: "${product.productName}" has ${product.quantity} units left (threshold: ${product.thresholdLevel}).`,
      timestamp: new Date().toISOString(),
    };

    store.alerts.push(alert);
    mockSendEmail(alert);
    console.log(`[ALERT TRIGGERED] ${alert.message}`);

    return alert;
  }
  return null;
};

module.exports = { checkThresholdAndAlert };
