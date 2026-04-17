import { useState } from 'react';

const INITIAL = { productId: '', quantity: '' };

export default function StockUpdater({ onSubmit, loading }) {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.productId.trim()) e.productId = 'Product ID is required';
    if (form.quantity === '' || isNaN(form.quantity) || Number(form.quantity) < 0)
      e.quantity = 'Quantity must be ≥ 0';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    const ok = await onSubmit({ productId: form.productId.trim(), quantity: Number(form.quantity) });
    if (ok) setForm(INITIAL);
  };

  return (
    <div className="card">
      <h2 className="card-title">Update Stock</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <div className="field">
            <label>Product ID <span className="required">*</span></label>
            <input name="productId" value={form.productId} onChange={handleChange} placeholder="Paste product UUID here" className={errors.productId ? 'input-error' : ''} />
            {errors.productId && <span className="error-msg">{errors.productId}</span>}
          </div>
          <div className="field">
            <label>New Quantity <span className="required">*</span></label>
            <input type="number" name="quantity" value={form.quantity} onChange={handleChange} placeholder="e.g. 25" min="0" className={errors.quantity ? 'input-error' : ''} />
            {errors.quantity && <span className="error-msg">{errors.quantity}</span>}
          </div>
        </div>
        <button type="submit" className="btn btn-secondary" disabled={loading}>
          {loading ? <span className="spinner" /> : null}
          {loading ? 'Updating…' : 'Update Stock'}
        </button>
      </form>
    </div>
  );
}
