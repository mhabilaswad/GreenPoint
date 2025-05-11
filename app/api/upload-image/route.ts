import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Image from '../../models/Image';

export async function POST(req: Request) {
  try {
    // Mendapatkan data dari request body
    const { name, email, title, description, image } = await req.json();

    if (!name || !email || !title || !image) {
      return NextResponse.json({ message: 'Missing email, title, or image' }, { status: 400 });
    }

    // Melakukan koneksi ke database
    await connectDB();

    // Membuat instance baru dari model Image dan menyimpannya
    const newImage = new Image({
      name,
      email, // Menyimpan email yang diterima
      title,
      description,
      image,
    });

    // Menyimpan data image ke database
    await newImage.save();

    return NextResponse.json({ message: 'Image saved successfully' }, { status: 201 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}