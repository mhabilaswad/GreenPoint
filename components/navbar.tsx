"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Leaf } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [showMenu, setShowMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showMenu && !(event.target as HTMLElement).closest(".relative")) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Kiri - Logo dan Judul */}
        <div className="flex items-center space-x-6 w-full max-w-[40%]">
          <Link href="/" className="flex items-center space-x-2">
            <Leaf className="h-6 w-6 text-green-600" />
            <span className="font-bold text-xl text-green-600">GreenPoint</span>
          </Link>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex-1">
            <input
              type="text"
              placeholder="Search plant photos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none"
            />
          </form>
        </div>

        {/* Kanan - Menu */}
        <div className="flex items-center space-x-4">
          {session ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link href="/photos">
                <Button variant="ghost">Photos</Button>
              </Link>
              <div className="relative">
                <div
                  className="w-8 h-8 rounded-full overflow-hidden cursor-pointer"
                  onClick={() => setShowMenu(!showMenu)}
                >
                  <img
                    src={session.user.image || "/images/default_profile.png"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-black border rounded shadow-lg">
                    <div className="px-4 py-2 text-white">
                      <div className="font-medium text-sm truncate">{session.user.name}</div>
                      <div className="text-xs truncate">{session.user.email}</div>
                    </div>
                    <Link href="/profile">
                      <div className="px-4 py-2 hover:bg-gray-100 hover:bg-opacity-20 cursor-pointer">
                        Show Profile
                      </div>
                    </Link>
                    <div
                      className="px-4 py-2 text-red-600 hover:bg-gray-100 hover:bg-opacity-20 cursor-pointer"
                      onClick={() => signOut()}
                    >
                      Sign Out
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/auth/signin">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
