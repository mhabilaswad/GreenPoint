"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";  // Menambahkan useSession dari NextAuth
import ChatbotWidget from "@/components/ChatbotWidget";

export default function Upload() {
  const { data: session } = useSession();  // Mendapatkan data session
  const { toast } = useToast();
  const [points, setPoints] = useState<number>(0);
  const [file, setFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [plantName, setPlantName] = useState<string>("");
  const [plantDescription, setPlantDescription] = useState<string>("");
  const [lastClassification, setLastClassification] = useState<string | null>(null);
  const [lastPoints, setLastPoints] = useState<number | null>(null);
  const [confidenceScore, setConfidenceScore] = useState<number | null>(null);
  const router = useRouter();

  const [predictedClass, setPredictedClass] = useState<string | null>(null);
  const [predictionLoading, setPredictionLoading] = useState(false);
  const [predictionError, setPredictionError] = useState<string | null>(null);

  // Cek jika session ada, ambil email pengguna dari session
  const userEmail = session?.user?.email || "";
  const userName = session?.user?.name || "";

  const fetchUserPoints = async () => {
    const res = await fetch(`/api/get-points?email=${userEmail}`);
    const data = await res.json();

    if (res.ok && typeof data.totalPoints === 'number') {
      setPoints(data.totalPoints);
    } else {
      console.error("Failed to fetch points from DB:", data.message);
    }
  };

  const updatePointsInDB = async (pointsToAdd: number) => {
    const res = await fetch("/api/update-points", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail, pointsToAdd }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast({
        title: "Error",
        description: data.message || "Failed to update points.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  useEffect(() => {
    if (userEmail) {
      fetchUserPoints();
    }
  }, [userEmail]);

  const classifications = [
    { value: "Plants not detected!", message: "Plants not detected!", points: 0, color: "red" },
    { value: "Your Plant is wilting!", message: "Your Plant is wilting!", points: 50, color: "red" },
    { value: "Your Plant seems Good!", message: "Your Plant seems Good!", points: 75, color: "yellow" },
    { value: "Your Plant is Excellent!", message: "Your Plant is Excellent!", points: 100, color: "green" },
  ];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      setPreviewImage(URL.createObjectURL(selectedFile));
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handlePredict = async (): Promise<{ predicted: string; confidence: number } | null> => {
    if (!file) {
      toast({
        title: "No Image Selected",
        description: "Please upload an image before predicting.",
        variant: "destructive",
      });
      return null;
    }

    setPredictionLoading(true);
    setPredictionError(null);
    setPredictedClass(null);
    setConfidenceScore(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("https://greenpoint-cnn-model-production.up.railway.app/predict", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Prediction API error");
      }

      const data = await res.json();
      const predicted = data.class;
      const confidence = Math.round(data.confidence * 100);

      setPredictedClass(predicted);
      setConfidenceScore(confidence);

      return { predicted, confidence }; // kembalikan hasil prediksi langsung
    } catch (error: any) {
      setPredictionError(error.message || "Unknown prediction error");
      return null;
    } finally {
      setPredictionLoading(false);
    }
  };


  // Untuk handle upload
  const handleUpload = async () => {
    if (!file || !plantName || !plantDescription) {
      toast({
        title: !file
          ? "No Image Selected"
          : !plantName
            ? "No Plant Name Provided"
            : "No Plant Description Provided",
        description: !file
          ? "Please upload an image."
          : !plantName
            ? "Please enter the name of your plant."
            : "Please enter the description of your plant.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setConfidenceScore(null);

    const base64Image = await convertToBase64(file);

    try {
      const result = await handlePredict();

      if (!result) return; // jika error

      const { predicted, confidence } = result;

      // simpan hasil prediksi & confidence untuk ditampilkan
      setPredictedClass(predicted);
      setConfidenceScore(confidence);

      if (predicted === "Plants not detected!") {
        toast({
          title: "Prediction",
          description: "Plants not detected! Image not uploaded.",
          variant: "destructive",
        });
        return;
      }

      // lanjut upload karena tanaman terdeteksi
      const uploadRes = await fetch("/api/upload-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userName,
          email: userEmail,
          title: plantName,
          description: plantDescription,
          image: base64Image,
        }),
      });

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        throw new Error(uploadData.message || "Image upload failed");
      }

      // klasifikasi berdasarkan hasil predicted
      const selectedClassification = classifications.find(
        (c) => c.value === predicted
      );

      if (!selectedClassification) {
        setPredictionError("Prediction result did not match any classification.");
        return;
      }

      const addedPoints = selectedClassification.points;

      if (addedPoints > 0) {
        const updated = await updatePointsInDB(addedPoints);

        if (updated) {
          await fetchUserPoints(); // refresh total points
          setLastClassification(selectedClassification.message);
          setLastPoints(addedPoints);

          toast({
            title: "Result",
            description: `${selectedClassification.message} (+${addedPoints} points)`,
            variant: selectedClassification.color === "red" ? "destructive" : "default",
          });
        }
      }

      setFile(null);
      setPreviewImage(null);
      setPlantName("");
      setPlantDescription("");

    } catch (error: any) {
      toast({
        title: "Upload Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
      <ChatbotWidget />
      <div className="w-full max-w-3xl space-y-4">
        <h2 className="text-3xl font-bold text-center">Upload your plant images to gain points!</h2>
        <p className="text-center text-gray-600 mb-4">
          Once you upload an image, it will be evaluated by our AI model.
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
            <img src={previewImage} alt="Selected Image" className="w-full h-full object-contain" />
          ) : (
            <span className="text-gray-500">Click to upload an image</span>
          )}
        </div>

        <textarea
          placeholder="Enter Plant Description"
          value={plantDescription}
          onChange={(e) => setPlantDescription(e.target.value)}
          className="border rounded p-2 w-full h-24 resize-none"
        />

        <Button onClick={handleUpload} className="w-full mb-4" disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </Button>
        {predictionLoading && <p>Predicting...</p>}

        {predictedClass && confidenceScore !== null && (() => {
          const resultColor = classifications.find(c => c.value === predictedClass)?.color || "gray";
          const colorMap = {
            green: "bg-green-100 text-green-800",
            yellow: "bg-yellow-100 text-yellow-800",
            red: "bg-red-100 text-red-800",
            gray: "bg-gray-100 text-gray-800"
          };

          return (
            <div className={`mt-4 p-4 rounded ${colorMap[resultColor]}`}>
              <strong>Prediction Result:</strong> {predictedClass} ({confidenceScore}% confident)
            </div>
          );
        })()}


        <p>Total Points: {points}</p>

        {lastClassification && (
          <div className="mt-4 text-center">
            <p className="text-xl font-bold text-green-700">You gained {lastPoints} points!</p>
            <p className="text-md text-gray-700 italic mt-1">{lastClassification}</p>
          </div>
        )}

        {confidenceScore !== null && (
          <div className="text-center mt-6 mb-10">
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
  );
}
