const store = require('../data/store');
const { checkThresholdAndAlert } = require('../services/alertService');
const { addOrUpdateProduct, updateStock } = require('../services/inventoryService');

beforeEach(() => {
  store.products = [];
  store.alerts = [];
});

describe('Alert Service - checkThresholdAndAlert', () => {
  test('should create an alert when quantity is below threshold', async () => {
    const product = { productId: 'p1', productName: 'Widget', quantity: 3, thresholdLevel: 10 };
    const alert = await checkThresholdAndAlert(product);

    expect(alert).not.toBeNull();
    expect(alert.productId).toBe('p1');
    expect(alert.message).toContain('Widget');
    expect(alert.timestamp).toBeDefined();
    expect(store.alerts).toHaveLength(1);
  });

  test('should NOT create an alert when quantity is above threshold', async () => {
    const product = { productId: 'p2', productName: 'Gadget', quantity: 50, thresholdLevel: 10 };
    const alert = await checkThresholdAndAlert(product);

    expect(alert).toBeNull();
    expect(store.alerts).toHaveLength(0);
  });

  test('should NOT create an alert when quantity equals threshold', async () => {
    const product = { productId: 'p3', productName: 'Gizmo', quantity: 10, thresholdLevel: 10 };
    const alert = await checkThresholdAndAlert(product);

    expect(alert).toBeNull();
    expect(store.alerts).toHaveLength(0);
  });
});

describe('Inventory Service - addOrUpdateProduct', () => {
  test('should add a new product and return created: true', async () => {
    const { product, created } = await addOrUpdateProduct({
      productName: 'Bolt',
      quantity: 100,
      thresholdLevel: 20,
    });

    expect(created).toBe(true);
    expect(product.productId).toBeDefined();
    expect(store.products).toHaveLength(1);
  });

  test('should update an existing product and return created: false', async () => {
    await addOrUpdateProduct({ productId: 'existing-id', productName: 'Bolt', quantity: 100, thresholdLevel: 20 });
    const { product, created } = await addOrUpdateProduct({
      productId: 'existing-id',
      productName: 'Bolt Updated',
      quantity: 5,
      thresholdLevel: 20,
    });

    expect(created).toBe(false);
    expect(product.productName).toBe('Bolt Updated');
    expect(store.products).toHaveLength(1);
    expect(store.alerts).toHaveLength(1);
  });
});

describe('Inventory Service - updateStock', () => {
  test('should return null for a non-existent product', async () => {
    const result = await updateStock('non-existent-id', 10);
    expect(result).toBeNull();
  });

  test('should update stock and trigger alert when below threshold', async () => {
    await addOrUpdateProduct({ productId: 'stock-test', productName: 'Nut', quantity: 50, thresholdLevel: 10 });
    store.alerts = [];

    const updated = await updateStock('stock-test', 2);
    expect(updated.quantity).toBe(2);
    expect(store.alerts).toHaveLength(1);
  });
});
