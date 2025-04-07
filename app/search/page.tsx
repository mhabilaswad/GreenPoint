"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type Photo = {
  url: string;
  name: string;
};

const checkImageExists = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [likes, setLikes] = useState<{ [url: string]: number }>({});

  const extensions = ["jpg", "jpeg", "png"];

  useEffect(() => {
    const loadMawarPhotos = async () => {
      const foundPhotos: Photo[] = [];

      for (let i = 1; i <= 5; i++) {
        let found = false;
        for (const ext of extensions) {
          const url = `/images/Mawar${i}.${ext}`;
          const exists = await checkImageExists(url);
          if (exists) {
            foundPhotos.push({ url, name: `Mawar ${i}` });
            found = true;
            break;
          }
        }
        if (!found) {
          console.warn(`Mawar${i} with any extension not found`);
        }
      }

      setPhotos(foundPhotos);
      setLoading(false);
    };

    if (query && "mawar".includes(query)) {
      setLoading(true);
      loadMawarPhotos();
    } else {
      setPhotos([]);
      setLoading(false);
    }
  }, [query]);

  const handleLike = (url: string) => {
    setLikes((prev) => ({
      ...prev,
      [url]: (prev[url] || 0) + 1,
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-4">
        Search Results for: <span className="text-green-600">{query}</span>
      </h2>

      {loading ? (
        <p>Loading photos...</p>
      ) : photos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((photo, index) => (
            <div
              key={index}
              className="border rounded-lg overflow-hidden shadow cursor-pointer transform transition-transform duration-300 hover:scale-105"
            >
              <img
                src={photo.url}
                alt={photo.name}
                className="w-full h-64 object-cover"
                onClick={() => setSelectedPhoto(photo)}
              />
              <div className="px-4 py-2 bg-black text-white">
                <p className="text-sm font-semibold">{photo.name}</p>
                <p className="text-xs text-gray-400">Uploaded by someone</p>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={() => handleLike(photo.url)}
                    className="text-red-500 hover:text-red-600 text-lg"
                  >
                    ❤️
                  </button>
                  <span className="text-sm">{likes[photo.url] || 0} likes</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No photos found for "{query}".</p>
      )}

      {/* Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="bg-white rounded-lg p-2">
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.name}
              className="w-[600px] h-[400px] object-cover rounded shadow-lg"
            />
            <p className="text-center mt-2 font-semibold">{selectedPhoto.name}</p>
          </div>
        </div>
      )}
    </div>
  );
}
