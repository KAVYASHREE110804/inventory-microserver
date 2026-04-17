import { useState, useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import * as api from '../services/api';

const ALERT_POLL_INTERVAL = 5000;

export function useInventory() {
  const [products, setProducts] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState({ products: false, alerts: false, form: false, stock: false });
  const prevAlertCount = useRef(0);

  const setLoad = (key, val) => setLoading((l) => ({ ...l, [key]: val }));

  const fetchProducts = useCallback(async () => {
    setLoad('products', true);
    try {
      const { data } = await api.getProducts();
      setProducts(data.data);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoad('products', false);
    }
  }, []);

  const fetchAlerts = useCallback(async (silent = false) => {
    if (!silent) setLoad('alerts', true);
    try {
      const { data } = await api.getAlerts();
      const incoming = data.data;
      if (incoming.length > prevAlertCount.current && prevAlertCount.current !== 0) {
        const diff = incoming.length - prevAlertCount.current;
        toast(`🔔 ${diff} new low-stock alert${diff > 1 ? 's' : ''}!`, { icon: '⚠️' });
      }
      prevAlertCount.current = incoming.length;
      setAlerts(incoming);
    } catch (e) {
      if (!silent) toast.error(e.message);
    } finally {
      if (!silent) setLoad('alerts', false);
    }
  }, []);

  const submitProduct = useCallback(async (formData) => {
    setLoad('form', true);
    try {
      const { data } = await api.addOrUpdateProduct(formData);
      toast.success(
        formData.productId
          ? `"${data.data.productName}" updated successfully`
          : `"${data.data.productName}" added successfully`
      );
      await Promise.all([fetchProducts(), fetchAlerts(true)]);
      return true;
    } catch (e) {
      toast.error(e.message);
      return false;
    } finally {
      setLoad('form', false);
    }
  }, [fetchProducts, fetchAlerts]);

  const submitStockUpdate = useCallback(async (stockData) => {
    setLoad('stock', true);
    try {
      const { data } = await api.updateStock(stockData);
      toast.success(`Stock updated for "${data.data.productName}"`);
      await Promise.all([fetchProducts(), fetchAlerts(true)]);
      return true;
    } catch (e) {
      toast.error(e.message);
      return false;
    } finally {
      setLoad('stock', false);
    }
  }, [fetchProducts, fetchAlerts]);

  useEffect(() => {
    fetchProducts();
    fetchAlerts();
    const interval = setInterval(() => fetchAlerts(true), ALERT_POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchProducts, fetchAlerts]);

  return {
    products,
    alerts,
    loading,
    fetchProducts,
    fetchAlerts,
    submitProduct,
    submitStockUpdate,
  };
}
