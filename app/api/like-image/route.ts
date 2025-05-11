import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import connectDB from '@/lib/mongodb';
import Image from '../../models/Image';

export async function POST(req: NextRequest) {
  try {
    // Mendapatkan token dari request
    const token = await getToken({ req });

    // Cek apakah token valid (user sudah login)
    if (!token || !token.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const email = token.email;

    // Parsing body request
    const { imageUrl } = await req.json();

    if (typeof imageUrl !== 'string') {
      return NextResponse.json({ message: 'Image URL is required' }, { status: 400 });
    }

    // Koneksi ke database
    await connectDB();

    // Cari foto berdasarkan URL
    const image = await Image.findOne({ url: imageUrl });

    if (!image) {
      return NextResponse.json({ message: 'Image not found' }, { status: 404 });
    }

    // Menambah jumlah like
    image.likes += 1;
    await image.save();

    return NextResponse.json({
      message: 'Like added successfully',
      totalLikes: image.likes,
    });
  } catch (error) {
    console.error('Error adding like:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
