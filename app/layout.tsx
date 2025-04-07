import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/components/auth-provider';
import Navbar from '@/components/navbar';
import PhotosPage from './photos/page';
import Footer from '@/components/Footer'; // Import the Footer component

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GreenPoint - Earn Points with Your Plants',
  description: 'Upload plant photos, get health scores, and earn points to become a Garden Expert.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <main className="min-h-screen bg-background">{children}</main>
            <Footer /> {/* Add the Footer component here */}
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}