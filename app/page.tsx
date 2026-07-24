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

const css = `
  .page-wrap {
    position: relative;
    z-index: 1;
    max-width: 780px;
    margin: 0 auto;
    padding: 5rem 2rem 7rem;
  }
  .page-header {
    margin-bottom: 4rem;
    opacity: 0;
    animation: fadeIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  .eyebrow {
    font-family: 'DM Mono', monospace;
    font-size: 0.6875rem;
    font-weight: 400;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  .eyebrow::before {
    content: '';
    display: inline-block;
    width: 2rem;
    height: 1px;
    background: var(--text-muted);
  }
  .page-title {
    font-size: clamp(2.5rem, 7vw, 4rem);
    font-weight: 700;
    line-height: 1.0;
    letter-spacing: -0.04em;
    color: var(--text-primary);
  }
  .page-title em {
    font-style: normal;
    position: relative;
    display: inline-block;
  }
  .page-title em::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0.05em;
    width: 100%;
    height: 3px;
    background: var(--text-primary);
    transform: scaleX(0);
    transform-origin: left;
    animation: underlineReveal 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.8s forwards;
  }
  .page-subtitle {
    margin-top: 1rem;
    font-size: 0.9375rem;
    font-weight: 300;
    color: var(--text-secondary);
    max-width: 400px;
    letter-spacing: 0.01em;
  }
  .divider {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin: 3rem 0 2rem;
    opacity: 0;
    animation: fadeIn 0.5s ease 0.5s forwards;
  }
  .divider-line { flex: 1; height: 1px; background: var(--border); }
  .divider-text {
    font-family: 'DM Mono', monospace;
    font-size: 0.625rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-muted);
    white-space: nowrap;
  }
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 0;
    padding: 2.5rem;
    margin-bottom: 3rem;
    opacity: 0;
    transform: translateY(24px);
    animation: slideUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.2s forwards;
    transition: border-color 0.3s ease;
  }
  .card:hover { border-color: var(--text-primary); }
  .form-grid { display: grid; gap: 1.5rem; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
  @media (max-width: 540px) {
    .form-row { grid-template-columns: 1fr; }
    .card { padding: 1.5rem; }
    .page-wrap { padding: 3rem 1.25rem 5rem; }
  }
  .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
  .form-label {
    font-family: 'DM Mono', monospace;
    font-size: 0.6875rem;
    font-weight: 400;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-muted);
    transition: color 0.2s;
  }
  .form-group:focus-within .form-label { color: var(--text-primary); }
  .form-input {
    width: 100%;
    padding: 0.8rem 1rem;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 0;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.9375rem;
    font-weight: 400;
    color: var(--text-primary);
    outline: none;
    transition: all 0.25s ease;
    -webkit-appearance: none;
    appearance: none;
  }
  .form-input::placeholder { color: var(--text-muted); font-weight: 300; }
  .form-input:hover { border-color: var(--text-secondary); }
  .form-input:focus {
    border-color: var(--text-primary);
    border-width: 2px;
    padding: calc(0.8rem - 1px) calc(1rem - 1px);
    box-shadow: 4px 4px 0 var(--text-primary);
  }
  .file-wrapper { position: relative; }
  .file-wrapper .form-input[type="file"] { cursor: pointer; padding: 0.75rem 1rem; }
  .file-wrapper .form-input[type="file"]::-webkit-file-upload-button {
    background: var(--text-primary);
    color: var(--accent-inverse);
    border: none;
    padding: 0.3rem 0.75rem;
    font-family: 'DM Mono', monospace;
    font-size: 0.6875rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    margin-right: 0.75rem;
    transition: all 0.2s;
  }
  .file-wrapper .form-input[type="file"]::-webkit-file-upload-button:hover { background: var(--text-secondary); }
  .btn-submit {
    margin-top: 2rem;
    width: 100%;
    padding: 1rem 2rem;
    background: var(--text-primary);
    color: var(--accent-inverse);
    border: 2px solid var(--text-primary);
    border-radius: 0;
    font-family: 'DM Mono', monospace;
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .btn-submit::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--accent-inverse);
    transform: translateX(-101%);
    transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .btn-submit:hover::before { transform: translateX(0); }
  .btn-submit:hover {
    color: var(--text-primary);
    border-color: var(--text-primary);
    box-shadow: 6px 6px 0 var(--text-primary);
    transform: translate(-2px, -2px);
  }
  .btn-submit:active { transform: translate(0, 0); box-shadow: none; }
  .btn-submit:disabled {
    background: var(--border);
    color: var(--text-muted);
    border-color: var(--border);
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }
  .btn-submit:disabled::before { display: none; }
  .btn-submit span { position: relative; z-index: 1; }
  .table-wrap {
    border: 1px solid var(--border);
    overflow: hidden;
    opacity: 0;
    transform: translateY(20px);
    animation: slideUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.4s forwards;
    transition: border-color 0.3s;
  }
  .table-wrap:hover { border-color: var(--text-primary); }
  .data-table { width: 100%; border-collapse: collapse; }
  .data-table thead { border-bottom: 2px solid var(--text-primary); }
  .data-table th {
    padding: 0.875rem 1.25rem;
    font-family: 'DM Mono', monospace;
    font-size: 0.625rem;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-muted);
    background: var(--surface);
    text-align: left;
  }
  .data-table td {
    padding: 1rem 1.25rem;
    font-size: 0.9375rem;
    color: var(--text-primary);
    border-bottom: 1px solid var(--border);
    vertical-align: middle;
  }
  .data-table tbody tr:last-child td { border-bottom: none; }
  .data-table tbody tr { transition: background 0.15s ease; cursor: default; }
  .data-table tbody tr:hover td { background: var(--hover-bg); }
  .data-table tbody tr:hover td:first-child { padding-left: 1.5rem; }
  .name-cell { font-weight: 600; font-size: 0.9375rem; letter-spacing: -0.01em; }
  .meta-cell {
    color: var(--text-secondary);
    font-weight: 300;
    font-size: 0.875rem;
    font-family: 'DM Mono', monospace;
  }
  .avatar {
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 0;
    border: 1px solid var(--border);
    display: block;
    margin: 0 auto;
    filter: grayscale(100%);
    transition: filter 0.3s ease;
  }
  .data-table tbody tr:hover .avatar { filter: grayscale(0%); }
  .avatar-placeholder {
    width: 40px;
    height: 40px;
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Mono', monospace;
    font-size: 0.5625rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0 auto;
    background: var(--surface);
  }
  .empty-state { padding: 5rem 2rem; text-align: center; }
  .empty-state svg { opacity: 0.15; margin-bottom: 1.5rem; }
  .empty-state p { font-size: 0.875rem; color: var(--text-muted); font-weight: 300; }
  .stats-bar {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 1rem;
    padding: 0.75rem 1rem;
    border: 1px solid var(--border);
    background: var(--surface);
    opacity: 0;
    animation: fadeIn 0.5s ease 0.6s forwards;
  }
  .stat-item { font-family: 'DM Mono', monospace; font-size: 0.6875rem; color: var(--text-muted); letter-spacing: 0.08em; }
  .stat-item strong { color: var(--text-primary); font-weight: 500; }
  .stat-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--text-muted); flex-shrink: 0; }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes underlineReveal { from { transform: scaleX(0); transform-origin: left; } to { transform: scaleX(1); transform-origin: left; } }
`;

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

  useEffect(() => { fetchUsers(); }, []);

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
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="page-wrap">
        <header className="page-header">
          <p className="eyebrow">Formulir Entry</p>
          <h1 className="page-title">Data<em>&nbsp;Diri</em></h1>
          <p className="page-subtitle">Catat informasi pribadi ke dalam sistem database.</p>
        </header>

        <form onSubmit={handleSubmit} className="card">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Nama Lengkap</label>
              <input type="text" placeholder="Masukkan nama lengkap" value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })} required className="form-input" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Umur</label>
                <input type="number" placeholder="Contoh: 25" min="1" value={form.umur}
                  onChange={(e) => setForm({ ...form, umur: e.target.value })} required className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Tinggi (cm)</label>
                <input type="number" placeholder="Contoh: 170" min="1" value={form.tinggi}
                  onChange={(e) => setForm({ ...form, tinggi: e.target.value })} required className="form-input" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Foto Diri</label>
              <div className="file-wrapper">
                <input id="fotoInput" type="file" accept="image/*"
                  onChange={(e) => setFoto(e.target.files?.[0] ?? null)} className="form-input" />
              </div>
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-submit">
            <span>{loading ? 'Menyimpan...' : 'Simpan Data Diri'}</span>
          </button>
        </form>

        <div className="divider">
          <div className="divider-line" />
          <span className="divider-text">{users.length} Entri</span>
          <div className="divider-line" />
        </div>

        {users.length > 0 && (
          <div className="stats-bar">
            <span className="stat-item">Total <strong>{users.length}</strong></span>
            <div className="stat-dot" />
            <span className="stat-item">Rata-rata Umur <strong>{Math.round(users.reduce((s, u) => s + u.umur, 0) / users.length)} thn</strong></span>
            <div className="stat-dot" />
            <span className="stat-item">Rata-rata Tinggi <strong>{Math.round(users.reduce((s, u) => s + u.tinggi, 0) / users.length)} cm</strong></span>
          </div>
        )}

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
    </>
  );
}
