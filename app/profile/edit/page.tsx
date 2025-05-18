"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const updateUserProfile = async (data: {
  name: string;
  linkedin: string;
  github: string;
}) => {
  const response = await fetch("/api/user", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update profile");
  }

  return await response.json();
};

export default function EditProfile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [name, setName] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");

  // Redirect user if not authenticated
useEffect(() => {
  console.log("Session status:", status); // Log status session
  if (status === "unauthenticated") {
    router.push("/auth/signin");
  } else if (status === "authenticated" && session?.user) {
    setName(session.user.name || "");
    setLinkedin(session.user.linkedin || "");
    setGithub(session.user.github || "");
  }
}, [status, session, router]);


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  console.log("Button clicked!"); // Tambahkan log untuk memastikan fungsi dijalankan

  if (status !== "authenticated") return;

  const updatedData = {
    name: name || "", // jika kosong, kirim undefined
    linkedin: linkedin || "",
    github: github || "",
  };

  try {
    const response = await updateUserProfile(updatedData);

    // Pastikan response mengembalikan data yang benar
    if (response?.user) {
      console.log("Updated profile:", response.user);
    }

    alert("Profile updated successfully!"); // Tampilkan pesan sukses
    router.push("/profile"); // Redirect ke halaman profil setelah berhasil
  } catch (error) {
    console.error("Failed to update profile:", error);
  }
};




  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
      <Card className="w-full max-w-md relative">
        <button
          onClick={() => router.back()}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border rounded p-2 w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                value={session?.user.email || ""}
                readOnly
                className="border rounded p-2 w-full bg-gray cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Tier</label>
              <input
                type="tier"
                value={session?.user.tier || ""}
                readOnly
                className="border rounded p-2 w-full bg-gray cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">LinkedIn</label>
              <input
                type="text"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                className="border rounded p-2 w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">GitHub</label>
              <input
                type="text"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                className="border rounded p-2 w-full"
              />
            </div>
            <Button type="submit" className="w-full">
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
