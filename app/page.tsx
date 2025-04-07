"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Upload, Award, LineChart } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();

  // Fade-in effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.fade-in');
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('visible');
        } else {
          el.classList.remove('visible');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="container mx-auto px-4 py-14">
      {/* Hero Section */}
      <div className="text-center mb-16 fade-in">
        <h1 className="text-5xl font-bold tracking-tight mb-4">
          <span className="text-white">Welcome to</span> <span className="text-green-600">GreenPoint</span>
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          Upload your plant photos, get AI-powered health scores, and earn points on your journey to becoming a Garden Expert.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 fade-in">
        <Card className="shadow-lg transition-transform transform hover:scale-105">
          <CardHeader>
            <Upload className="w-10 h-10 mb-2 text-green-600" />
            <CardTitle className="text-xl">Upload Daily</CardTitle>
            <CardDescription className="text-sm">Share one plant photo every day</CardDescription>
          </CardHeader>
        </Card>

        <Card className="shadow-lg transition-transform transform hover:scale-105">
          <CardHeader>
            <Leaf className="w-10 h-10 mb-2 text-green-600" />
            <CardTitle className="text-xl">AI Analysis</CardTitle>
            <CardDescription className="text-sm">Get instant plant health scores</CardDescription>
          </CardHeader>
        </Card>

        <Card className="shadow-lg transition-transform transform hover:scale-105">
          <CardHeader>
            <LineChart className="w-10 h-10 mb-2 text-green-600" />
            <CardTitle className="text-xl">Earn Points</CardTitle>
            <CardDescription className="text-sm">Build your gardening score</CardDescription>
          </CardHeader>
        </Card>

        <Card className="shadow-lg transition-transform transform hover:scale-105">
          <CardHeader>
            <Award className="w-10 h-10 mb-2 text-green-600" />
            <CardTitle className="text-xl">Get Certified</CardTitle>
            <CardDescription className="text-sm">Become a Garden Expert</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Call-to-action Buttons */}
      <div className="flex justify-center gap-4 mb-24 fade-in">
        <Link href="/auth/signin">
          <Button size="lg" className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white">Get Started</Button>
        </Link>
        <Link href="/about">
          <Button variant="outline" size="lg" className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white">Learn More</Button>
        </Link>
      </div>

      {/* Community Section */}
      <div className="fade-in flex flex-col md:flex-row items-center mb-16">
        <div className="md:w-1/2 md:pr-8">
          <h3 className="text-2xl font-semibold mb-2">Join a Thriving Community</h3>
          <p className="text-gray-600 text-base">
            Connect with fellow gardeners, share tips, and learn from each other's experiences.
            Our community is here to support you on your gardening journey.
          </p>
        </div>
        <div className="md:w-1/2 md:pl-8">
          <img src="/images/community.jpg" alt="Community" className="w-full rounded-lg shadow-md h-64 object-cover" />
        </div>
      </div>

      {/* Progress Tracking Section */}
      <div className="fade-in flex flex-col md:flex-row items-center mb-16">
        <div className="md:w-1/2 md:pr-8 order-2 md:order-1">
          <img src="/images/progress.jpeg" alt="Progress Tracking" className="w-full rounded-lg shadow-md h-64 object-cover" />
        </div>
        <div className="md:w-1/2 md:pr-8 order-1 md:order-2 text-right">
          <h3 className="text-2xl font-semibold mb-2">Track Your Progress</h3>
          <p className="text-gray-600 text-base">
            With our AI-powered health scores, you can easily track the progress of your plants and receive personalized recommendations
            to improve their health and growth.
          </p>
        </div>
      </div>

      {/* Rewards Section */}
      <div className="fade-in flex flex-col md:flex-row items-center mb-24">
        <div className="md:w-1/2 md:pr-8">
          <h3 className="text-2xl font-semibold mb-2">Earn Rewards</h3>
          <p className="text-gray-600 text-base">
            As you engage with the app, you can earn points and unlock achievements that recognize your dedication to gardening.
            Get rewarded for your efforts and become a certified Garden Expert!
          </p>
        </div>
        <div className="md:w-1/2 md:pl-8">
          <img src="/images/reward.jpg" alt="Rewards" className="w-full rounded-lg shadow-md h-64 object-cover" />
        </div>
      </div>

      {/* CNN Explanation Section */}
      <div className="text-center mb-16 fade-in">
        <p className="text-sm text-gray-500 mb-1">Detected using a</p>
        <h2 className="text-3xl font-bold mb-4">Convolutional Neural Network (CNN)</h2>
        <div className="max-w-4xl mx-auto text-center text-gray-600 mb-8">
          <p>
            Our AI model uses Convolutional Neural Networks (CNN), a deep learning method inspired by how the human eye processes visual information.
            It helps us detect plant conditions with high accuracy from uploaded photos.
          </p>
        </div>

        {/* Example Detection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center image-container">
            <h3 className="text-red-600 font-bold mb-2">Wilting</h3>
            <img src="/images/layu.png" alt="Layu" className="w-full h-64 rounded-lg shadow-md object-cover" />
          </div>
          <div className="text-center image-container">
            <h3 className="text-yellow-600 font-bold mb-2">Good</h3>
            <img src="/images/normal.jpg" alt="Normal" className="w-full h-64 rounded-lg shadow-md object-cover" />
          </div>
          <div className="text-center image-container">
            <h3 className="text-green-600 font-bold mb-2">Healthy</h3>
            <img src="/images/segar.png" alt="Segar" className="w-full h-64 rounded-lg shadow-md object-cover" />
          </div>
        </div>
      </div>

      {/* Confidence Score */}
      <div className="text-center mb-10">
        <h4 className="text-lg font-semibold mb-2">Example Detection Confidence</h4>
        <div className="w-full md:w-1/2 mx-auto bg-gray-200 rounded-full h-4">
          <div className="bg-green-500 h-4 rounded-full" style={{ width: '87%' }}></div>
        </div>
        <p className="text-sm text-gray-500 mt-2">Confidence Score: 87%</p>
      </div>

      {/* Testimonial */}
      <div className="text-center max-w-3xl mx-auto mb-8 text-gray-600 italic">
        <p>
          "Thanks to GreenPoint, I realized my plant was suffering from overwatering. Now it's thriving again!"
          <br />— A happy gardener 🌱
        </p>
      </div>

      {/* CSS Styles for fade-in and hover */}
      <style jsx>{`
        .fade-in {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.5s ease-out, transform 0.5s ease-out;
        }
        .fade-in.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .image-container:hover img,
        .image-container:hover h3 {
          transform: scale(1.05);
        }
        .image-container img,
        .image-container h3 {
          transition: transform 0.3s ease;
        }
      `}</style>
    </div>
  );
}
