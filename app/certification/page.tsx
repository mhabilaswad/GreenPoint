"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Certification() {
  const certificateUrl = "/images/sertifikat.png";
  const shareUrl = "http://localhost:3000/certification";
  const [copied, setCopied] = useState(false);

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // Januari = 0
  const currentYear = currentDate.getFullYear();

  // Credential ID: format unik (misal: GP-843219)
  const generateCredentialId = () => {
    const prefix = "GP";
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    return `${prefix}-${randomNumber}`;
  };

  const credentialId = generateCredentialId();

  const captionText = `🌱 I'm officially a Beginner Gardener! 🏅

Thanks to the GreenPoint platform, I’ve completed my first 1000 points by taking care of plants and using AI-based evaluation.

Check out my certificate here: ${shareUrl}

#Gardening #Sustainability #GreenPoint`;

  const handleLinkedInAddLicense = () => {
    const base = "https://www.linkedin.com/profile/add?";
    const params = new URLSearchParams({
      startTask: "CERTIFICATION_NAME",
      name: "GreenPoint - Beginner Gardener",
      organizationName: "HN",
      issueYear: currentYear.toString(),
      issueMonth: currentMonth.toString(),
      credentialId: credentialId,
      credentialUrl: shareUrl,
    });

    window.open(base + params.toString(), "_blank", "noopener,noreferrer");
  };

  const handleLinkedInShare = () => {
    const shareBase = "https://www.linkedin.com/sharing/share-offsite/?";
    const postText = encodeURIComponent(captionText);
    const url = `${shareBase}url=${encodeURIComponent(shareUrl)}&summary=${postText}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(captionText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-3xl font-bold mb-4">Certification</h1>
        <p className="text-lg mb-2">For reaching the 1000 point milestone,</p>
        <img src={certificateUrl} alt="Certificate" className="w-full h-auto mb-4 rounded shadow-lg" />
        <p className="mt-2 text-xl font-semibold">Congratulations! 🎉</p>
        <p className="text-lg mt-1">
          You are now a <span className="font-bold text-green-600">"Beginner Gardener"</span>!
        </p>

        <div className="mt-6 space-y-2">
          <a
            href={certificateUrl}
            download
            className="inline-block text-blue-500 underline text-sm"
          >
            Download your certificate
          </a>

          <Button
            onClick={handleLinkedInShare}
            className="w-full text-white"
            style={{ backgroundColor: '#2563EB' }} // ganti bg-blue-600
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#1D4ED8')} // ganti bg-blue-700
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#2563EB')}
          >
            Share Certificate as Post on LinkedIn
          </Button>

          <Button
            onClick={handleLinkedInAddLicense}
            className="w-full text-white"
            style={{ backgroundColor: '#16A34A' }} // ganti bg-green-600
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#15803D')} // ganti bg-green-700
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#16A34A')}
          >
            Add Certificate to LinkedIn Profile
          </Button>

          <Button
            variant="outline"
            onClick={handleCopyCaption}
            className="w-full"
          >
            {copied ? "Copied!" : "Copy LinkedIn Caption"}
          </Button>
        </div>

        <p className="text-sm mt-4 text-gray-600 italic">
          *To include the certificate in your LinkedIn profile, paste this link as the credential URL.*
        </p>
      </div>
    </div>
  );
}
