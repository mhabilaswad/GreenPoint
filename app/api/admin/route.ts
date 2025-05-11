import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Image from "../../models/Image";

export async function GET() {
  try {
    await connectDB();

    const users = await User.find({ role: "user" });
    const images = await Image.find();

    return NextResponse.json({ users, images });
  } catch (error) {
    console.error("Error fetching admin data:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin data" },
      { status: 500 }
    );
  }
}

// CREATE
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { type, data } = body;

    if (type === "user") {
      const newUser = await User.create(data);
      return NextResponse.json({ message: "User created", user: newUser });
    } else if (type === "image") {
      const newImage = await Image.create(data);
      return NextResponse.json({ message: "Image created", image: newImage });
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error creating data:", error);
    return NextResponse.json({ error: "Failed to create data" }, { status: 500 });
  }
}

// UPDATE
export async function PUT(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { type, id, data } = body;

    if (type === "user") {
      const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });
      return NextResponse.json({ message: "User updated", user: updatedUser });
    } else if (type === "image") {
      const updatedImage = await Image.findByIdAndUpdate(id, data, { new: true });
      return NextResponse.json({ message: "Image updated", image: updatedImage });
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error updating data:", error);
    return NextResponse.json({ error: "Failed to update data" }, { status: 500 });
  }
}

// DELETE
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { type, id } = body;

    if (type === "user") {
      await User.findByIdAndDelete(id);
      return NextResponse.json({ message: "User deleted" });
    } else if (type === "image") {
      await Image.findByIdAndDelete(id);
      return NextResponse.json({ message: "Image deleted" });
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error deleting data:", error);
    return NextResponse.json({ error: "Failed to delete data" }, { status: 500 });
  }
}
