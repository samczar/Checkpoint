// frontend/src/components/StandupForm.tsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { standupService } from '../services/api';

export default function StandupForm() {
  const { isAuthenticated } = useAuth();
  const [form, setForm] = useState({ yesterday: '', today: '', blockers: '' });
  const [loading, setLoading] = useState(false);
  const [standups, setStandups] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load today's standup if exists
    api.get('/standups/mine').then(res => {
      const today = new Date().toISOString().slice(0, 10);
      const entry = res.data.find((s:any) => s.date === today);
      if (entry) setForm(entry);
    });
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      standupService.getMine()
        .then(response => {
          setStandups(response.data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to fetch standups:', err);
          setError('Failed to load standups. Please try again.');
          setLoading(false);
        });
    }
  }, [isAuthenticated]);



  const handleChange = (e:any) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setLoading(true);
    await api.post('/standups', form);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea name="yesterday" value={form.yesterday} onChange={handleChange} placeholder="What did you do yesterday?" required className="w-full p-2 border rounded" />
      <textarea name="today" value={form.today} onChange={handleChange} placeholder="What will you do today?" required className="w-full p-2 border rounded" />
      <textarea name="blockers" value={form.blockers} onChange={handleChange} placeholder="Any blockers?" className="w-full p-2 border rounded" />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>
        {loading ? 'Saving...' : 'Save Standup'}
      </button>
    </form>
  );
}