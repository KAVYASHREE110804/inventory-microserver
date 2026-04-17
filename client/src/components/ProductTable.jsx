import { useState } from 'react';

export default function ProductTable({ products, loading, onRefresh }) {
  const [search, setSearch] = useState('');

  const filtered = products.filter((p) =>
    p.productName.toLowerCase().includes(search.toLowerCase()) ||
    p.productId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Products</h2>
        <div className="card-actions">
          <input
            className="search-input"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-ghost" onClick={onRefresh} disabled={loading} title="Refresh">
            <span className={loading ? 'spin' : ''}>↻</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="center-msg"><span className="spinner large" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📦</span>
          <p>{search ? 'No products match your search.' : 'No products yet. Add one above!'}</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Product ID</th>
                <th>Quantity</th>
                <th>Threshold</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const isLow = p.quantity < p.thresholdLevel;
                return (
                  <tr key={p.productId} className={isLow ? 'row-low' : ''}>
                    <td className="bold">{p.productName}</td>
                    <td className="mono">{p.productId}</td>
                    <td className={isLow ? 'qty-low' : 'qty-ok'}>{p.quantity}</td>
                    <td>{p.thresholdLevel}</td>
                    <td>
                      <span className={`badge ${isLow ? 'badge-danger' : 'badge-success'}`}>
                        {isLow ? '⚠ Low Stock' : '✓ Normal'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <p className="table-footer">{products.length} product{products.length !== 1 ? 's' : ''} total</p>
    </div>
  );
}
