// app/api/users/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';

// 1. GET: Mengambil semua data user dari database
export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM users ORDER BY id DESC');
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('Database Error:', error);
    return NextResponse.json(
      { 
        message: 'Gagal mengambil data dari database',
        detail: error?.message || String(error)
      },
      { status: 500 }
    );
  }
}

// 2. POST: Menerima input form + upload foto lalu simpan ke database
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const nama = formData.get('nama') as string;
    const umur = formData.get('umur') as string;
    const tinggi = formData.get('tinggi') as string;
    const file = formData.get('foto') as File | null;

    let photoPath = null;

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.name) || '.jpg';
      const filename = `${uniqueSuffix}${ext}`;

      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadDir, { recursive: true });

      const filepath = path.join(uploadDir, filename);
      await writeFile(filepath, buffer);

      photoPath = `/uploads/${filename}`;
    }

    await db.query(
      'INSERT INTO users (nama, umur, tinggi, foto) VALUES (?, ?, ?, ?)',
      [nama, parseInt(umur) || 0, parseInt(tinggi) || 0, photoPath]
    );

    return NextResponse.json({ message: 'Data berhasil disimpan' }, { status: 201 });
  } catch (error: any) {
    console.error('POST Error:', error);
    
    // Kembalikan detail error ke browser agar langsung tau letak masalahnya
    return NextResponse.json(
      { 
        message: 'Gagal menyimpan data ke database',
        detail: error?.message || String(error),
        code: error?.code || 'UNKNOWN_ERROR'
      },
      { status: 500 }
    );
  }
}

// 3. DELETE: Hapus data user berdasarkan id
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'ID diperlukan' }, { status: 400 });
    }

    // Ambil path foto sebelum hapus
    const [rows] = await db.query('SELECT foto FROM users WHERE id = ?', [id]) as [any[], any];
    const user = rows[0];

    if (!user) {
      return NextResponse.json({ message: 'Data tidak ditemukan' }, { status: 404 });
    }

    // Hapus foto dari filesystem jika ada
    if (user.foto) {
      const filepath = path.join(process.cwd(), 'public', user.foto);
      await unlink(filepath).catch(() => {}); // abaikan error jika file tidak ada
    }

    // Hapus dari database
    await db.query('DELETE FROM users WHERE id = ?', [id]);

    return NextResponse.json({ message: 'Data berhasil dihapus' });
  } catch (error: any) {
    console.error('DELETE Error:', error);
    return NextResponse.json(
      { 
        message: 'Gagal menghapus data',
        detail: error?.message || String(error)
      }, 
      { status: 500 }
    );
  }
}