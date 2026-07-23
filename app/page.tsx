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

export default function HomePage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [nama, setNama] = useState('');
  const [umur, setUmur] = useState('');
  const [tinggi, setTinggi] = useState('');
  const [foto, setFoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('nama', nama);
    formData.append('umur', umur);
    formData.append('tinggi', tinggi);
    if (foto) formData.append('foto', foto);

    try {
      const res = await fetch('/api/users', { method: 'POST', body: formData });
      if (res.ok) {
        setNama('');
        setUmur('');
        setTinggi('');
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

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus data ini?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/users?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchUsers();
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-center mb-6">Input Data Diri</h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card">
          <div className="flex flex-col gap-4">
            <div className="form-group">
              <label className="form-label">Nama Lengkap</label>
              <input
                id="fotoInput"
                type="text"
                placeholder="Masukkan Nama"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Umur (Tahun)</label>
              <input
                type="number"
                placeholder="Masukkan Umur"
                value={umur}
                onChange={(e) => setUmur(e.target.value)}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tinggi Badan (cm)</label>
              <input
                type="number"
                placeholder="Masukkan Tinggi Badan"
                value={tinggi}
                onChange={(e) => setTinggi(e.target.value)}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Foto Diri</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFoto(e.target.files?.[0] ?? null)}
                className="form-input file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-600 file:cursor-pointer"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Menyimpan...' : 'Simpan Data Diri'}
            </button>
          </div>
        </form>

        {/* Table */}
        <h2 className="text-xl font-semibold mb-3">Daftar Data Diri (db_crudtest)</h2>
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="data-table">
            <thead>
              <tr>
                <th className="w-20">Foto</th>
                <th>Nama</th>
                <th>Umur</th>
                <th>Tinggi</th>
                <th className="w-20">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    Belum ada data / Loading...
                  </td>
                </tr>
              ) : (
                users.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="text-center">
                      {item.foto ? (
                        <img src={item.foto} alt={item.nama} className="avatar mx-auto" />
                      ) : (
                        <span className="avatar-placeholder">No Image</span>
                      )}
                    </td>
                    <td className="font-medium">{item.nama}</td>
                    <td>{item.umur} Tahun</td>
                    <td>{item.tinggi} cm</td>
                    <td>
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                        className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400 transition"
                      >
                        {deletingId === item.id ? '...' : 'Hapus'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
