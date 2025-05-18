// app/api/searching/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Image from '../../models/Image';

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase() || '';
    const regex = new RegExp(query, 'i'); // Case-insensitive regex

    // Cari berdasarkan title ATAU name (yang disimpan langsung di Image)
    const hasilPencarian = await Image.find({
      $or: [
        { title: { $regex: regex } },
        { name: { $regex: regex } },
      ],
    }).limit(5);

    console.log("Hasil pencarian gambar:", hasilPencarian);
    return NextResponse.json(hasilPencarian);
  } catch (error) {
    console.error('Error searching images:', error);
    return NextResponse.json({ error: 'Failed to search images' }, { status: 500 });
  }
}
