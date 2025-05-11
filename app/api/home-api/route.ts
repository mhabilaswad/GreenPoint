// app/api/home-api/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Image from "../../models/Image"; // Sesuaikan dengan model Image

export async function GET(request: Request) {
  try {
    await connectDB(); // Pastikan koneksi ke database berhasil

    // Mengambil semua gambar tanpa query
    const hasilPencarian = await Image.find().limit(10); // Membatasi jumlah gambar yang ditampilkan

    console.log("Hasil gambar:", hasilPencarian);

    // Mengirimkan hasil gambar sebagai respons
    return NextResponse.json(hasilPencarian);
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 });
  }
}