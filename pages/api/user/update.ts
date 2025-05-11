import { getSession } from "next-auth/react";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma"; // Ensure this path is correct

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const session = await getSession({ req });

    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { name, nickname, linkedin, github } = req.body;

    try {
      // Update the user in the database
      const updatedUser = await prisma.user.update({
        where: { email: session.user.email }, // email is unique identifier
        data: {
          name,
          nickname,
          linkedin,
          github,
        },
      });

      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(500).json({ message: "Error updating profile", error });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 