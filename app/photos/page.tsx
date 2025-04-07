"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function PhotosPage() {
  const { data: session } = useSession();
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    // Fetch photos uploaded by the user
    if (session) {
      fetch(`/api/photos?user=${session.user.email}`)
        .then((response) => response.json())
        .then((data) => setPhotos(data));
    }
  }, [session]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-4">Your Uploaded Photos</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {photos.map((photo, index) => (
          <div key={index} className="border rounded-lg overflow-hidden">
            <img src={photo.url} alt={`Uploaded photo ${index + 1}`} className="w-full h-64 object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
} 