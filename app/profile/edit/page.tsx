"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const updateUserProfile = async (data: { name: string; email: string; nickname: string; linkedin: string; github: string }) => {
  const response = await fetch('/api/user/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update profile');
  }

  return await response.json();
};

export default function EditProfile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [linkedin, setLinkedin] = useState<string>("");
  const [github, setGithub] = useState<string>("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated") {
      // Populate fields with current user data
      setName(session.user.name || "");
      setNickname(session.user.nickname || "");
      setLinkedin(session.user.linkedin || "");
      setGithub(session.user.github || "");
    }
  }, [status, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      console.error("User is not authenticated");
      return;
    }

    try {
      await updateUserProfile({ 
        name, 
        email: session?.user.email || "", // Ensure email is a string
        nickname, 
        linkedin, 
        github 
      });
      // Redirect back to the profile page after updating
      router.push("/profile");
    } catch (error) {
      console.error("Failed to update profile:", error);
      // Optionally, show an error message to the user
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
      <Card className="w-full max-w-md relative">
  {/* Tombol X untuk kembali */}
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
                className="border rounded p-2 w-full bg-gray-200 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Nickname</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="border rounded p-2 w-full"
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
