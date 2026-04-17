import { useState } from 'react';

const INITIAL = { productId: '', productName: '', quantity: '', thresholdLevel: '' };

export default function ProductForm({ onSubmit, loading }) {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.productName.trim()) e.productName = 'Product name is required';
    if (form.quantity === '' || isNaN(form.quantity) || Number(form.quantity) < 0)
      e.quantity = 'Quantity must be ≥ 0';
    if (!form.thresholdLevel || isNaN(form.thresholdLevel) || Number(form.thresholdLevel) < 1)
      e.thresholdLevel = 'Threshold must be ≥ 1';
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
    const payload = {
      ...(form.productId.trim() && { productId: form.productId.trim() }),
      productName: form.productName.trim(),
      quantity: Number(form.quantity),
      thresholdLevel: Number(form.thresholdLevel),
    };
    const ok = await onSubmit(payload);
    if (ok) setForm(INITIAL);
  };

  return (
    <div className="card">
      <h2 className="card-title">Add / Update Product</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <div className="field">
            <label>Product ID <span className="hint">(optional — for update)</span></label>
            <input name="productId" value={form.productId} onChange={handleChange} placeholder="Leave blank to create new" />
          </div>
          <div className="field">
            <label>Product Name <span className="required">*</span></label>
            <input name="productName" value={form.productName} onChange={handleChange} placeholder="e.g. Wireless Mouse" className={errors.productName ? 'input-error' : ''} />
            {errors.productName && <span className="error-msg">{errors.productName}</span>}
          </div>
          <div className="field">
            <label>Quantity <span className="required">*</span></label>
            <input type="number" name="quantity" value={form.quantity} onChange={handleChange} placeholder="e.g. 5" min="0" className={errors.quantity ? 'input-error' : ''} />
            {errors.quantity && <span className="error-msg">{errors.quantity}</span>}
          </div>
          <div className="field">
            <label>Threshold Level <span className="required">*</span></label>
            <input type="number" name="thresholdLevel" value={form.thresholdLevel} onChange={handleChange} placeholder="e.g. 10" min="1" className={errors.thresholdLevel ? 'input-error' : ''} />
            {errors.thresholdLevel && <span className="error-msg">{errors.thresholdLevel}</span>}
          </div>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? <span className="spinner" /> : null}
          {loading ? 'Saving…' : 'Save Product'}
        </button>
      </form>
    </div>
  );
}
