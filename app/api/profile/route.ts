// app/api/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Image from "../../models/Image";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const images = await Image.find({ email }).limit(10);
    return NextResponse.json(images);
  } catch (error) {
    console.error("Error fetching user images:", error);
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 });
  }
}

// Tambahkan handler PUT di bawah GET
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const { url, title, description } = await request.json();

    if (!url || !title || !description) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const updated = await Image.findOneAndUpdate(
      { url },
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