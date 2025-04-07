"use client";

import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-medium">Name: {session?.user?.name}</h2>
              <p>Email: {session?.user?.email}</p>
            </div>
            <div className="mt-4">
              <h3 className="text-md font-medium">Profile Photo:</h3>
              <div className="w-24 h-24 rounded-full overflow-hidden">
                <img
                  src={session?.user?.image || "/images/default_profile.png"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-md font-medium">Nickname:</h3>
              <p>{session?.user?.nickname || "No nickname set"}</p>
            </div>
            <div className="mt-4">
              <h3 className="text-md font-medium">LinkedIn:</h3>
              <p>{session?.user?.linkedin || "No LinkedIn profile set"}</p>
            </div>
            <div className="mt-4">
              <h3 className="text-md font-medium">GitHub:</h3>
              <p>{session?.user?.github || "No GitHub profile set"}</p>
            </div>            
            <Button onClick={() => router.push("/profile/edit")} className="w-full mt-4">
              Edit Profile
            </Button>
            <Button
  onClick={() => signOut()}
  className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white"
>
  Sign Out
</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 