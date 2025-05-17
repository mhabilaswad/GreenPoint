import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function PUT(req: NextRequest) {
  try {
    // Mendapatkan token dari request
    const token = await getToken({ req });

    // Cek apakah token valid (user sudah login)
    if (!token || !token.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const email = token.email;

    // Parsing body request
    const { name, tier, linkedin, github } = await req.json();

    // Koneksi ke database
    await connectDB();

    // Cari user berdasarkan email dari token
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Update user profile
    if (name) user.name = name;
    if (linkedin) user.linkedin = linkedin;
    if (github) user.github = github;

    // Simpan perubahan
    await user.save();

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: { name: user.name, linkedin: user.linkedin, github: user.github },
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}