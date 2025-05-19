// app/api/home-api/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Image from "../../models/Image"; // Model Image
import User from "../../models/User"; // Model User

export async function GET(request: Request) {
  try {
    await connectDB();

    const hasilPencarian = await Image.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "email",
          foreignField: "email",
          as: "userInfo",
        },
      },
      {
        $unwind: "$userInfo",
      },
      {
        $project: {
          image: 1,
          title: 1,
          name: 1,
          description: 1,
          likes: 1,
          email: 1,
          "userInfo.linkedin": 1,
          "userInfo.github": 1,
          "userInfo.tier": 1,
          "userInfo.points": 1,
        },
      },
    ]);

    console.log("Hasil gambar dan pengguna:", hasilPencarian);

    return new NextResponse(JSON.stringify(hasilPencarian), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store", // penting agar tidak di-cache
      },
    });
  } catch (error) {
    console.error("Error fetching images and user data:", error);
    return NextResponse.json(
      { error: "Failed to fetch images and user data" },
      { status: 500 }
    );
  }
}
