import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Image from "../../models/Image"; // Model Image
import User from "../../models/User"; // Model User

export async function GET(request: Request) {
  try {
    await connectDB(); // Pastikan koneksi ke database berhasil

    // Melakukan aggregation untuk mendapatkan informasi gambar + pengguna berdasarkan email
    const hasilPencarian = await Image.aggregate([
      {
        $lookup: {
          from: "users", // Koleksi Users
          localField: "email", // Field di Image yang akan dicocokkan
          foreignField: "email", // Field di User yang akan dicocokkan
          as: "userInfo", // Nama alias hasil gabungan
        },
      },
      {
        $unwind: "$userInfo", // Mengurai hasil gabungan menjadi field yang lebih mudah diakses
      },
      {
        $project: {
          image: 1,
          title: 1,
          name: 1,
          description: 1,
          likes: 1,
          email: 1,
          "userInfo.linkedin": 1, // Menambahkan linkedin pengguna
          "userInfo.github": 1, // Menambahkan github pengguna
          "userInfo.tier": 1, // Menambahkan tier pengguna
          "userInfo.points": 1, // Menambahkan point pengguna
        },
      },
    ]);

    console.log("Hasil gambar dan pengguna:", hasilPencarian);

    // Mengirimkan hasil gambar dan informasi pengguna sebagai respons
    return NextResponse.json(hasilPencarian);
  } catch (error) {
    console.error("Error fetching images and user data:", error);
    return NextResponse.json({ error: "Failed to fetch images and user data" }, { status: 500 });
  }
}
