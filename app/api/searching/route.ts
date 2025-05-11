// app/api/searching/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Image from '../../models/Image'; // Sesuaikan dengan model Image

export async function GET(request: Request) {
  try {
    await connectDB(); // Pastikan koneksi ke database berhasil

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase() || '';

    // Membuat regex untuk pencarian yang case-insensitive
    const regex = new RegExp(query, 'i'); // Case insensitive

    // Mencari gambar dengan judul yang sesuai dengan query
    const hasilPencarian = await Image.find({
      title: { $regex: regex }, // Pencarian berdasarkan 'title'
    }).limit(5); // Limit jumlah gambar yang ditampilkan

    console.log("Hasil pencarian gambar:", hasilPencarian);

    // Mengirimkan hasil pencarian sebagai respons
    return NextResponse.json(hasilPencarian);
  } catch (error) {
    console.error('Error searching images:', error);
    return NextResponse.json({ error: 'Failed to search images' }, { status: 500 });
  }
}