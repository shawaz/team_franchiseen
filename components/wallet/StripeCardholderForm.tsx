'use client';

import React, { useState } from 'react';

const initialForm = {
  name: '',
  phone: '',
  line1: '',
  city: '',
  state: '',
  country: 'IN',
  postal_code: '',
  govIdFront: null as File | null,
  govIdBack: null as File | null,
};

const StripeCardholderForm: React.FC = () => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // 1. Upload files (replace with your upload logic, e.g. UploadThing, S3, etc)
    const uploadFile = async (file: File) => {
      const body = new FormData();
      body.append('file', file);
      // Replace with your upload endpoint
      const res = await fetch('/api/upload', { method: 'POST', body });
      const data = await res.json();
      return data.url; // The uploaded file URL
    };

    try {
      if (form.govIdFront) await uploadFile(form.govIdFront);
      if (form.govIdBack) await uploadFile(form.govIdBack);
    } catch {
      setError('Failed to upload ID images');
      setLoading(false);
      return;
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto bg-white dark:bg-stone-800 p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-2">Activate Your Account</h2>
      <div className="grid grid-cols-1 gap-3">
        <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required className="input w-full" />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="input w-full" />
        <input name="line1" placeholder="Address Line 1" value={form.line1} onChange={handleChange} required className="input w-full" />
        <input name="city" placeholder="City" value={form.city} onChange={handleChange} required className="input w-full" />
        <input name="state" placeholder="State" value={form.state} onChange={handleChange} required className="input w-full" />
        <input name="postal_code" placeholder="Postal Code" value={form.postal_code} onChange={handleChange} required className="input w-full" />
        <input name="country" placeholder="Country" value={form.country} onChange={handleChange} required className="input w-full" />
        <label className="block text-sm font-medium mt-2">Government ID (Front)</label>
        <input type="file" name="govIdFront" accept="image/*,application/pdf" onChange={handleChange} required className="input w-full" />
        <label className="block text-sm font-medium mt-2">Government ID (Back)</label>
        <input type="file" name="govIdBack" accept="image/*,application/pdf" onChange={handleChange} required className="input w-full" />
      </div>
      {error && <div className="text-red-500">{error}</div>}
      <button type="submit" disabled={loading} className="btn btn-primary w-full mt-2">
        {loading ? 'Activating...' : 'Activate & Issue Card'}
      </button>
    </form>
  );
};

export default StripeCardholderForm; 