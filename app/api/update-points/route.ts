import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

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
    const { pointsToAdd } = await req.json();

    if (typeof pointsToAdd !== 'number') {
      return NextResponse.json({ message: 'Points must be a number' }, { status: 400 });
    }

    // Koneksi ke database
    await connectDB();

    // Cari user berdasarkan email dari token
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Tambahkan poin
    user.points += pointsToAdd;
    await user.save();

    return NextResponse.json({
      message: 'Points updated successfully',
      totalPoints: user.points,
    });
  } catch (error) {
    console.error('Error updating points:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
