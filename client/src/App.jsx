import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import ProductForm from './components/ProductForm';
import ProductTable from './components/ProductTable';
import StockUpdater from './components/StockUpdater';
import AlertList from './components/AlertList';
import { useInventory } from './hooks/useInventory';

export default function App() {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const { products, alerts, loading, fetchProducts, fetchAlerts, submitProduct, submitStockUpdate } = useInventory();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <header className="app-header">
        <div className="header-brand">
          <span className="header-icon">📦</span>
          <div>
            <h1>Inventory Alert</h1>
            <p className="header-sub">Microservice Dashboard</p>
          </div>
        </div>
        <button className="btn btn-ghost dark-toggle" onClick={() => setDark((d) => !d)} title="Toggle dark mode">
          {dark ? '☀️ Light' : '🌙 Dark'}
        </button>
      </header>

      <main className="app-main">
        <div className="col-left">
          <ProductForm onSubmit={submitProduct} loading={loading.form} />
          <StockUpdater onSubmit={submitStockUpdate} loading={loading.stock} />
        </div>
        <div className="col-right">
          <ProductTable products={products} loading={loading.products} onRefresh={fetchProducts} />
          <AlertList alerts={alerts} loading={loading.alerts} onRefresh={fetchAlerts} />
        </div>
      </main>
    </>
  );
}
