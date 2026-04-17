export default function AlertList({ alerts, loading, onRefresh }) {
  const fmt = (iso) =>
    new Date(iso).toLocaleString(undefined, {
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    });

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          Alerts
          {alerts.length > 0 && <span className="badge badge-danger ml">{alerts.length}</span>}
        </h2>
        <div className="card-actions">
          <span className="auto-refresh-label">Auto-refresh: 5s</span>
          <button className="btn btn-ghost" onClick={onRefresh} disabled={loading} title="Refresh now">
            <span className={loading ? 'spin' : ''}>↻</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="center-msg"><span className="spinner large" /></div>
      ) : alerts.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">✅</span>
          <p>No alerts. All stock levels are healthy!</p>
        </div>
      ) : (
        <ul className="alert-list">
          {[...alerts].reverse().map((a) => (
            <li key={a.id} className="alert-item">
              <div className="alert-icon">⚠️</div>
              <div className="alert-body">
                <p className="alert-message">{a.message}</p>
                <div className="alert-meta">
                  <span className="mono">{a.productId}</span>
                  <span className="alert-time">{fmt(a.timestamp)}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
