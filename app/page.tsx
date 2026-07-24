'use client';

import { useState, useEffect } from 'react';

type UserData = {
  id: number;
  nama: string;
  umur: number;
  tinggi: number;
  foto: string | null;
  created_at?: string;
};

// Inline SVG icons
const UserIcon = () => (
  <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

export default function HomePage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nama: '', umur: '', tinggi: '' });
  const [foto, setFoto] = useState<File | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (Array.isArray(data)) setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('nama', form.nama);
    formData.append('umur', form.umur);
    formData.append('tinggi', form.tinggi);
    if (foto) formData.append('foto', foto);

    try {
      const res = await fetch('/api/users', { method: 'POST', body: formData });
      if (res.ok) {
        setForm({ nama: '', umur: '', tinggi: '' });
        setFoto(null);
        (document.getElementById('fotoInput') as HTMLInputElement).value = '';
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrap">
      {/* Header */}
      <header className="page-header">
        <p className="eyebrow">Formulir Entry</p>
        <h1 className="page-title">
          Data<em>&nbsp;Diri</em>
        </h1>
        <p className="page-subtitle">
          Catat informasi pribadi ke dalam sistem database.
        </p>
      </header>

      {/* Form card */}
      <form onSubmit={handleSubmit} className="card">
        <div className="form-grid">
          {/* Nama — full width */}
          <div className="form-group">
            <label className="form-label">Nama Lengkap</label>
            <input
              type="text"
              placeholder="Masukkan nama lengkap"
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              required
              className="form-input"
            />
          </div>

          {/* Umur & Tinggi — side by side */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Umur</label>
              <input
                type="number"
                placeholder="Contoh: 25"
                min="1"
                value={form.umur}
                onChange={(e) => setForm({ ...form, umur: e.target.value })}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tinggi (cm)</label>
              <input
                type="number"
                placeholder="Contoh: 170"
                min="1"
                value={form.tinggi}
                onChange={(e) => setForm({ ...form, tinggi: e.target.value })}
                required
                className="form-input"
              />
            </div>
          </div>

          {/* Foto */}
          <div className="form-group">
            <label className="form-label">Foto Diri</label>
            <div className="file-wrapper">
              <input
                id="fotoInput"
                type="file"
                accept="image/*"
                onChange={(e) => setFoto(e.target.files?.[0] ?? null)}
                className="form-input"
              />
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-submit">
          <span>{loading ? 'Menyimpan...' : 'Simpan Data Diri'}</span>
        </button>
      </form>

      {/* Divider */}
      <div className="divider">
        <div className="divider-line" />
        <span className="divider-text">{users.length} Entri</span>
        <div className="divider-line" />
      </div>

      {/* Stats bar */}
      {users.length > 0 && (
        <div className="stats-bar">
          <span className="stat-item">Total <strong>{users.length}</strong></span>
          <div className="stat-dot" />
          <span className="stat-item">Rata-rata Umur <strong>{Math.round(users.reduce((s, u) => s + u.umur, 0) / users.length)} thn</strong></span>
          <div className="stat-dot" />
          <span className="stat-item">Rata-rata Tinggi <strong>{Math.round(users.reduce((s, u) => s + u.tinggi, 0) / users.length)} cm</strong></span>
        </div>
      )}

      {/* Table */}
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: 56 }}></th>
              <th>Nama</th>
              <th>Umur</th>
              <th>Tinggi</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={4}>
                  <div className="empty-state">
                    <UserIcon />
                    <p>Belum ada data. Isi formulir di atas untuk menambahkan.</p>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((item) => (
                <tr key={item.id}>
                  <td>
                    {item.foto ? (
                      <img src={item.foto} alt={item.nama} className="avatar" />
                    ) : (
                      <div className="avatar-placeholder">IMG</div>
                    )}
                  </td>
                  <td className="name-cell">{item.nama}</td>
                  <td className="meta-cell">{item.umur} thn</td>
                  <td className="meta-cell">{item.tinggi} cm</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
