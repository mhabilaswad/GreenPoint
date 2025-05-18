// app/api/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Image from "../../models/Image";

// Mengambil gambar berdasarkan email
export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const images = await Image.find({ email }).limit(10);

    console.log("Hasil pencarian gambar berdasarkan email:", images); // ✅ Tambahkan ini

    return NextResponse.json(images);
  } catch (error) {
    console.error("Error fetching user images:", error);
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 });
  }
}

// PUT untuk mengedit gambar berdasarkan _id
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const { _id, title, description, email } = await request.json();

    console.log("Received data:", { _id, title, description, email }); // Debugging log

    if (!_id || !title || !description || !email) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const updated = await Image.findOneAndUpdate(
      { _id: _id, email }, // Mencari gambar berdasarkan _id dan email
      { $set: { title, description } },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Image updated successfully", image: updated });
  } catch (error) {
    console.error("Error updating image:", error);
    return NextResponse.json({ error: "Failed to update image" }, { status: 500 });
  }
}

// DELETE untuk menghapus gambar berdasarkan _id dan email
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const { _id, email } = await request.json();

    console.log("Received for delete:", { _id, email });

    if (!_id || !email) {
      return NextResponse.json({ error: "Image _id and email are required" }, { status: 400 });
    }

    const deleted = await Image.findOneAndDelete({ _id, email });

    if (!deleted) {
      return NextResponse.json({ error: "Image not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}