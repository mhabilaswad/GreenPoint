"use client";

import { useEffect, useState } from "react";
import ChatbotWidget from "@/components/ChatbotWidget";

type Image = {
  points: number;
  tier: string;
  github: string;
  linkedin: string;
  url: string; // String Base64 image
  title: string;
  name: string;
  likes: number; // Jumlah like yang ditampilkan
  description: string;
};

export default function HomePage() {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  useEffect(() => {
    // Mengambil data gambar dan informasi pengguna dari API
    const loadImages = async () => {
      setLoading(true);

      // Mengambil semua gambar dan informasi pengguna dari API
      const response = await fetch("/api/home-api", {
        cache: "no-store",
      });

      const data = await response.json();

      // Memetakan data yang diterima ke dalam format yang sesuai
      const imagesData: Image[] = data.map((item: any) => ({
        url: item.image,  // Gambar Base64 yang diterima
        name: item.name,
        title: item.title, // Judul gambar
        likes: item.likes || 0, // Inisialisasi jumlah like
        description: item.description,
        email: item.email, // Menyertakan email pengguna yang meng-upload
        linkedin: item.userInfo.linkedin, // Menyertakan linkedin pengguna
        github: item.userInfo.github, // Menyertakan github pengguna
        tier: item.userInfo.tier,
        points: item.userInfo.points
      }));

      setImages(imagesData);
      setLoading(false);
    };


    loadImages();
  }, []);

  const handleLike = async (imageUrl: string) => {
    const res = await fetch("/api/like-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl }), // Mengirimkan URL gambar yang di-like
    });

    if (res.ok) {
      const data = await res.json();
      // Update jumlah like di UI
      setImages((prevImages) =>
        prevImages.map((image) =>
          image.url === imageUrl ? { ...image, likes: data.totalLikes } : image
        )
      );
    } else {
      console.error("Failed to add like");
    }
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Menghentikan klik agar modal tidak tertutup saat like diklik
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ChatbotWidget />
      <h2 className="text-3xl font-bold mb-4">Home</h2>

      {loading ? (
        <p>Loading images...</p>
      ) : images.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="border rounded-lg overflow-hidden shadow cursor-pointer transform transition-transform duration-300 hover:scale-105"
            >
              <div className="w-full h-64 flex items-center justify-center bg-black-100">
                <img
                  src={image.url}
                  alt={image.name}
                  className="w-full h-full object-cover"
                  onClick={() => setSelectedImage(image)}
                />
              </div>
              <div className="px-4 py-2 bg-black text-white">
                <p className="text-sm font-semibold">{image.title}</p>
                <p className="text-xs text-gray-400">Uploaded by {image.name}</p>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={() => handleLike(image.url)}
                    className="text-red-500 hover:text-red-600 text-lg"
                  >
                    ❤️
                  </button>
                  <span className="text-sm">{image.likes} likes</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No images available.</p>
      )}

      {/* Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="bg-white rounded-lg p-4 w-[700px] h-[700px] flex flex-col items-center"
            onClick={handleModalClick}
          >
            {/* Judul */}
            <p className="text-center text-xl font-bold text-black mb-2">
              {selectedImage.title}
            </p>

            {/* Gambar */}
            <div className="w-full h-[400px] flex items-center justify-center bg-gray-100 rounded shadow-lg">
              <img
                src={selectedImage.url}
                alt={selectedImage.name}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Kontainer vertikal */}
            <div className="flex flex-col items-start w-full gap-2 mt-4">
              {/* Like */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleLike(selectedImage.url)}
                  className="text-red-500 hover:text-red-600 text-lg"
                >
                  ❤️
                </button>
                <span className="text-sm text-black">{selectedImage.likes} likes</span>
              </div>

              {/* Info User + Deskripsi */}
              <div className="flex flex-col gap-1 w-full">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-black">{selectedImage.name}</p>
                  {selectedImage.tier && (
                    <>
                      <span
                        className={`font-bold ${selectedImage.tier === "New Gardener"
                          ? "text-[#808080]"
                          : selectedImage.tier === "Beginner Gardener"
                            ? "text-[#FFD700]"
                            : selectedImage.tier === "Intermediate Gardener"
                              ? "text-[#32CD32]"
                              : selectedImage.tier === "Expert Gardener"
                                ? "text-[#1E90FF]"
                                : selectedImage.tier === "Master Gardener"
                                  ? "text-[#DAA520]"
                                  : "text-black"
                          }`}
                      >
                        {selectedImage.tier}
                      </span>
                      {selectedImage.points !== undefined && (
                        <span
                          className={`font-semibold ${selectedImage.tier === "New Gardener"
                            ? "text-[#808080]"
                            : selectedImage.tier === "Beginner Gardener"
                              ? "text-[#FFD700]"
                              : selectedImage.tier === "Intermediate Gardener"
                                ? "text-[#32CD32]"
                                : selectedImage.tier === "Expert Gardener"
                                  ? "text-[#1E90FF]"
                                  : selectedImage.tier === "Master Gardener"
                                    ? "text-[#DAA520]"
                                    : "text-black"
                            }`}
                        >
                          ({selectedImage.points} Point)
                        </span>
                      )}
                    </>
                  )}
                </div>

                {/* Tampilkan LinkedIn dan GitHub jika ada */}
                <div className="flex gap-2">
                  {selectedImage.linkedin && (
                    <a
                      href={selectedImage.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#3B82F6]"
                    >
                      LinkedIn
                    </a>
                  )}
                  {selectedImage.github && (
                    <a
                      href={selectedImage.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#3B82F6]"
                    >
                      GitHub
                    </a>
                  )}
                </div>

                {/* Deskripsi scrollable */}
                <div className="text-gray-700 text-sm max-h-[120px] overflow-y-auto pr-2">
                  {selectedImage.description}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
