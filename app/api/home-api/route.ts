// app/api/home-api/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Image from "../../models/Image"; // Model Image
import User from "../../models/User"; // Model User

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.toLowerCase() || "";
    const regex = new RegExp(query, "i"); // Case-insensitive search

    const hasilPencarian = await Image.aggregate([
      {
        $match: {
          $or: [
            { title: { $regex: regex } },
            { name: { $regex: regex } },
          ],
        },
      },
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
      {
        $limit: query ? 5 : 1000, // jika ada query, batasi hasil seperti search
      },
    ]);

    console.log("Hasil gabungan image + user:", hasilPencarian);

    return new NextResponse(JSON.stringify(hasilPencarian), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Failed to fetch images and user data" },
      { status: 500 }
    );
  }
}
