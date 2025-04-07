"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { toast } = useToast();
  const [points, setPoints] = useState<number>(0);
  const [file, setFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [plantName, setPlantName] = useState<string>("");
  const router = useRouter();
  const [lastClassification, setLastClassification] = useState<string | null>(null);
  const [lastPoints, setLastPoints] = useState<number | null>(null);
  const [confidenceScore, setConfidenceScore] = useState<number | null>(null);


  useEffect(() => {
    // Load points from local storage on component mount
    const storedPoints = localStorage.getItem("points");
    if (storedPoints) {
      setPoints(Number(storedPoints));
    }
  }, []);

  useEffect(() => {
    // Update local storage whenever points change
    localStorage.setItem("points", points.toString());
  }, [points]);

  const classifications = [
    { message: "Plants not detected!", points: 0, color: "red" },
    { message: "Your Plant is wilting!", points: 50, color: "red" },
    { message: "Your Plant seems Good!", points: 75, color: "yellow" },
    { message: "Your Plant is Excellent!", points: 100, color: "green" },
  ];
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);

      const imageUrl = URL.createObjectURL(selectedFile);
      setPreviewImage(imageUrl);
    }
  };

  const handleUpload = () => {
    if (!file) {
      toast({
        title: "No Image Selected",
        description: "Please upload an image to get points.",
        variant: "destructive",
      });
      return;
    }

    if (!plantName) {
      toast({
        title: "No Plant Name Provided",
        description: "Please enter the name of your plant.",
        variant: "destructive",
      });
      return;
    }
    setConfidenceScore(null);

    setLoading(true);

    // Randomly select a classification
    const randomIndex = Math.floor(Math.random() * classifications.length);
    const selectedClassification = classifications[randomIndex];

    // Simulate a loading delay
    setTimeout(() => {
      // Update points based on the selected classification
      setPoints((prevPoints) => {
        const newPoints = prevPoints + selectedClassification.points;

        if (newPoints >= 500) {
          router.push("/certification");
        }

        return newPoints;
      });

      setLastClassification(selectedClassification.message);
      setLastPoints(selectedClassification.points);
      const randomConfidence = Math.floor(Math.random() * 51) + 50; // menghasilkan angka antara 50–100
      setConfidenceScore(randomConfidence);



      // Show the classification message with color coding
      toast({
        title: "Result",
        description: `${selectedClassification.message} (+${selectedClassification.points} points)`,
        variant: selectedClassification.color === "red" ? "destructive" : "default",
      });

      // Clear the file and preview image after upload
      setFile(null);
      setPreviewImage(null);
      setPlantName("");

      setLoading(false);
    }, 1000);
  };

  return (
    <div>
      <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
        <div className="w-full max-w-3xl">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-center">Upload your plant images to gain points!</h2>
            <p className="text-center text-gray-600 mb-4">
              Once you upload an image, it will be evaluated by our AI model. You'll earn points, and upon reaching certain milestones, you'll receive a certification as a Master Gardener!
            </p>
            <div className="text-center text-gray-600 mb-4 space-y-1">
            <p>500 Points → <strong>Beginner Gardener</strong></p>
            <p>2000 Points → <strong>Intermediate Gardener</strong></p>
            <p>5000 Points → <strong>Expert Gardener</strong></p>
            <p>10000 Points → <strong>Master Gardener</strong></p>
          </div>
            <input
              type="text"
              placeholder="Enter Plant Name"
              value={plantName}
              onChange={(e) => setPlantName(e.target.value)}
              className="border rounded p-2 w-full"
            />
            <div className="border-2 border-dashed border-gray-300 rounded-lg h-64 flex items-center justify-center relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              {previewImage ? (
                <img src={previewImage} alt="Selected Image" className="w-full h-full object-cover" style={{ objectFit: 'contain' }} />
              ) : (
                <span className="text-gray-500">Click to upload an image</span>
              )}
            </div>
            <Button onClick={handleUpload} className="w-full mb-4" disabled={loading}>
              {loading ? "Loading..." : "Upload"}
            </Button>
            <p>Total Points: {points}</p>
            {lastClassification && (
  <div className="mt-2 text-center">
    <p className="text-lg font-semibold">You gained {lastPoints} points!</p>
    <p className="text-md text-gray-700 italic">{lastClassification}</p>
  </div>
)}
{confidenceScore !== null && (
  <div className="text-center mb-10 mt-4">
    <h4 className="text-lg font-semibold mb-2">Detection Confidence</h4>
    <div className="w-full md:w-1/2 mx-auto bg-gray-200 rounded-full h-4">
      <div
        className="bg-green-500 h-4 rounded-full transition-all duration-500"
        style={{ width: `${confidenceScore}%` }}
      ></div>
    </div>
    <p className="text-sm text-gray-500 mt-2">Confidence Score: {confidenceScore}%</p>
  </div>
)}


          </div>
        </div>
      </div>
    </div>
  );
}