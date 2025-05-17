"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Image = {
  id: string;
  url: string;
  title: string;
  name: string;
  likes: number;
  description: string;
};

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingImageUrl, setEditingImageUrl] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (session?.user?.email) {
      const fetchImages = async () => {
        setLoading(true);
        const response = await fetch(`/api/profile?email=${session.user.email}`);
        const data = await response.json();

        const imagesData: Image[] = data.map((item: any) => ({
          id: item._id,
          url: item.image,
          name: item.name,
          title: item.title,
          likes: item.likes || 0,
          description: item.description || "",
        }));

        setImages(imagesData);
        setLoading(false);
      };

      fetchImages();
    }
  }, [status, session, router]);

  const handleLike = (imageUrl: string) => {
    setImages((prevImages) =>
      prevImages.map((image) =>
        image.url === imageUrl ? { ...image, likes: image.likes + 1 } : image
      )
    );
  };

  const handleEdit = (image: Image) => {
    setEditingImageUrl(image.url);
    setEditedTitle(image.title);
    setEditedDescription(image.description);
  };

  const handleCancel = () => {
    setEditingImageUrl(null);
    setEditedTitle("");
    setEditedDescription("");
  };

const handleSave = async (_id: string) => {
  console.log("Sending PUT request with:", {
    _id,
    title: editedTitle,
    description: editedDescription,
    email: session?.user?.email,
  });

  const response = await fetch("/api/profile", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      _id,
      title: editedTitle,
      description: editedDescription,
      email: session?.user?.email,
    }),
  });

  if (response.ok) {
    const updatedImages = images.map((img) =>
      img.id === _id ? { ...img, title: editedTitle, description: editedDescription } : img
    );
    setImages(updatedImages);
    handleCancel();
  } else {
    alert("Failed to update image");
  }
};

  if (status === "loading") return <div>Loading...</div>;

  return (
    <div className="container mx-auto flex flex-col items-center min-h-[calc(100vh-4rem)] py-8 px-4">
      <Card className="w-full max-w-5xl">
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
              <h3 className="text-md font-medium">Tier:</h3>
              <p>{(session?.user as any)?.tier || "No tier set"}</p>
            </div>
            <div className="mt-4">
              <h3 className="text-md font-medium">LinkedIn:</h3>
              <p>{(session?.user as any)?.linkedin || "No LinkedIn profile set"}</p>
            </div>
            <div className="mt-4">
              <h3 className="text-md font-medium">GitHub:</h3>
              <p>{(session?.user as any)?.github || "No GitHub profile set"}</p>
            </div>

            <Button onClick={() => router.push("/profile/edit")} className="w-full mt-4">
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Images Section */}
      <div className="mt-8 w-full max-w-5xl">
        <h3 className="text-md font-medium mb-4">Uploaded Images:</h3>

        {loading ? (
          <p>Loading images...</p>
        ) : images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image) => (
              <div key={image.id} className="border rounded-lg shadow overflow-hidden">
                <img
                  src={image.url}
                  alt={image.name}
                  className="w-full h-64 object-cover cursor-pointer"
                />
                <div className="p-4 text-white">
                  {editingImageUrl === image.url ? (
                    <>
                      <input
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="w-full mb-2 p-2 text-white rounded"
                        placeholder="Edit Title"
                      />
                      <textarea
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        className="w-full mb-2 p-2 text-white rounded"
                        placeholder="Edit Description"
                      />
                      <div className="flex justify-between">
                        <Button onClick={() => handleSave(image.id)}>Save</Button> {/* Ganti url dengan _id */}
                        <Button variant="secondary" onClick={handleCancel}>
                          Cancel
                        </Button>
                      </div>

                    </>
                  ) : (
                    <>
                      <p className="font-semibold">{image.title}</p>
                      <p className="text-sm">{image.description}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          onClick={() => handleLike(image.url)}
                          className="text-red-500 hover:text-red-600"
                        >
                          ❤️
                        </button>
                        <span>{image.likes} likes</span>
                      </div>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="mt-2"
                        onClick={() => handleEdit(image)}
                      >
                        Edit
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mt-4">No images found for "{session?.user?.email}".</p>
        )}
      </div>
    </div>
  );
}
