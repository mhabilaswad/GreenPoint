"use client";

// Fungsi truncate manual
function truncate(str: string, maxLength: number): string {
  return str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
}

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from "@radix-ui/react-alert-dialog";
import { AlertDialogHeader, AlertDialogFooter } from "@/components/ui/alert-dialog";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [users, setUsers] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // State untuk edit
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editingUserData, setEditingUserData] = useState<any>({});
  const [editingImageId, setEditingImageId] = useState<string | null>(null);
  const [editingImageData, setEditingImageData] = useState<any>({});
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [deleteImageId, setDeleteImageId] = useState<string | null>(null);
  const [showDeleteUserDialog, setShowDeleteUserDialog] = useState(false);
  const [showDeleteImageDialog, setShowDeleteImageDialog] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    if (!session || session.user.role !== "admin") {
      router.push("/");
    } else {
      fetchData();
    }
  }, [session, status]);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin");
      if (!res.ok) throw new Error("Failed to fetch data");

      const data = await res.json();
      setUsers(data.users || []);
      setImages(data.images || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // USER: Edit
  const handleEditUser = (userId: string) => {
    const user = users.find((u) => u._id === userId);
    if (user) {
      setEditingUserId(userId);
      setEditingUserData({ ...user });
    }
  };

  // USER: Save
  const handleSaveUser = async () => {
    try {
      await fetch("/api/admin", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "user",
          id: editingUserId,
          data: editingUserData,
        }),
      });
      // refresh data, reset form
      setEditingUserId(null);
      fetchData();
    } catch (err) {
      console.error("Failed to save user", err);
    }
  };

  // USER: Delete
  const handleDeleteUser = async (id: string) => {
    try {
      const res = await fetch("/api/admin", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "user", id }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Unknown error");

      // refresh data setelah delete berhasil
      fetchData();
    } catch (err) {
      console.error("Failed to delete user", err);
      alert("Gagal menghapus user.");
    }
  };


  // USER: Create (optional - modal / inline form bisa ditambahkan)
  const handleCreateUser = async () => {
    const newUser = {
      name: "New User",
      email: "new@example.com",
      nickname: "newbie",
      linkedin: "",
      github: "",
      points: 0,
      role: "user",
    };

    try {
      const res = await fetch("/api/admin/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (!res.ok) throw new Error("Failed to create user");

      await fetchData();
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  // IMAGE: Edit
  const handleEditImage = (imageId: string) => {
    const image = images.find((img) => img._id === imageId);
    if (image) {
      setEditingImageId(imageId);
      setEditingImageData({ ...image });
    }
  };

  // IMAGE: Save
  const handleSaveImage = async () => {
    try {
      await fetch("/api/admin", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "image",
          id: editingImageId,
          data: editingImageData,
        }),
      });
      // refresh data, reset form
      setEditingImageId(null);
      fetchData();
    } catch (err) {
      console.error("Failed to save image", err);
    }
  };

  // IMAGE: Delete
  const handleDeleteImage = async (id: string) => {
    try {
      const res = await fetch("/api/admin", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "image", id }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Unknown error");

      fetchData();
    } catch (err) {
      console.error("Failed to delete image", err);
      alert("Gagal menghapus gambar.");
    }
  };


  // IMAGE: Create
  const handleCreateImage = async () => {
    const newImage = {
      name: "Uploader Name",
      email: "uploader@example.com",
      title: "New Image Title",
      description: "Description here...",
      image: "https://placehold.co/600x400",
      likes: 0,
    };

    try {
      const res = await fetch("/api/admin/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newImage),
      });

      if (!res.ok) throw new Error("Failed to create image");

      await fetchData();
    } catch (error) {
      console.error("Error creating image:", error);
    }
  };

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Users Section */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Users</h2>
          <Button variant="default" onClick={handleCreateUser}>+ Create</Button>
        </div>
        <table className="w-full border text-sm">
          <thead>
            <tr>
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">Email</th>
              <th className="border px-2 py-1">Nickname</th>
              <th className="border px-2 py-1">LinkedIn</th>
              <th className="border px-2 py-1">GitHub</th>
              <th className="border px-2 py-1">Points</th>
              <th className="border px-2 py-1">Created At</th>
              <th className="border px-2 py-1">Role</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id}>
                  <td className="border px-2 py-1">{truncate(user.name, 20)}</td>
                  <td className="border px-2 py-1">{truncate(user.email, 20)}</td>
                  <td className="border px-2 py-1">{truncate(user.nickname, 20)}</td>
                  <td className="border px-2 py-1">{truncate(user.linkedin, 20)}</td>
                  <td className="border px-2 py-1">{truncate(user.github, 20)}</td>
                  <td className="border px-2 py-1">{user.points}</td>
                  <td className="border px-2 py-1">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="border px-2 py-1">{user.role}</td>
                  <td className="border px-2 py-1 space-x-2">
                    <Button variant="secondary" size="sm" onClick={() => handleEditUser(user._id)}>Edit</Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setDeleteUserId(user._id);
                        setShowDeleteUserDialog(true);
                      }}
                    >
                      Delete
                    </Button>

                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="border px-2 py-4 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

      </div>

      {/* Images Section */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Images</h2>
          <Button variant="default" onClick={handleCreateImage}>+ Create</Button>
        </div>
        <table className="w-full border text-sm">
          <thead>
            <tr>
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">Email</th>
              <th className="border px-2 py-1">Title</th>
              <th className="border px-2 py-1">Description</th>
              <th className="border px-2 py-1">Image URL</th>
              <th className="border px-2 py-1">Likes</th>
              <th className="border px-2 py-1">Uploaded At</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {images.length > 0 ? (
              images.map((img) => (
                <tr key={img._id}>
                  <td className="border px-2 py-1">{truncate(img.name, 20)}</td>
                  <td className="border px-2 py-1">{truncate(img.email, 20)}</td>
                  <td className="border px-2 py-1">{truncate(img.title, 20)}</td>
                  <td className="border px-2 py-1">{truncate(img.description, 20)}</td>
                  <td className="border px-2 py-1">{truncate(img.image, 20)}</td>
                  <td className="border px-2 py-1">{img.likes}</td>
                  <td className="border px-2 py-1">{new Date(img.uploadedAt).toLocaleDateString()}</td>
                  <td className="border px-2 py-1 space-x-2">
                    <Button variant="secondary" size="sm" onClick={() => handleEditImage(img._id)}>Edit</Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setDeleteImageId(img._id);
                        setShowDeleteImageDialog(true);
                      }}
                    >
                      Delete
                    </Button>

                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="border px-2 py-4 text-center text-gray-500">
                  No images found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* AlertDialog for confirming user deletion */}
      {showDeleteUserDialog && (
        <>
          <div className="fixed inset-0 bg-black opacity-50 z-10"></div> {/* Overlay */}
          <AlertDialog open={showDeleteUserDialog} onOpenChange={setShowDeleteUserDialog}>
            <AlertDialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg max-w-md z-20">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-black text-xl font-semibold">Delete User</AlertDialogTitle>
                <AlertDialogDescription className="text-sm text-gray-600">
                  Are you sure you want to delete this user? This action cannot be undone, and the user data will be permanently removed from the system.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="space-x-4">
                <AlertDialogCancel
                  className="py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-100 text-black"
                  onClick={() => setShowDeleteUserDialog(false)}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
                  onClick={() => {
                    if (deleteUserId) handleDeleteUser(deleteUserId);
                    setShowDeleteUserDialog(false);
                  }}
                >
                  Confirm Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}

      {/* AlertDialog for confirming user deletion */}
      {showDeleteImageDialog && (
        <>
          <div className="fixed inset-0 bg-black opacity-50 z-10"></div> {/* Overlay */}
          <AlertDialog open={showDeleteImageDialog} onOpenChange={setShowDeleteImageDialog}>
            <AlertDialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg max-w-md z-20">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-black text-xl font-semibold">Delete Image</AlertDialogTitle>
                <AlertDialogDescription className="text-sm text-gray-600">
                  Are you sure you want to delete this image? This action cannot be undone, and the image data will be permanently removed from the system.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="space-x-4">
                <AlertDialogCancel
                  className="py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-100 text-black"
                  onClick={() => setShowDeleteImageDialog(false)}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
                  onClick={() => {
                    if (deleteImageId) handleDeleteImage(deleteImageId);
                    setShowDeleteImageDialog(false);
                  }}
                >
                  Confirm Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}

      {/* Form Edit User with Overlay */}
      {editingUserId && (
        <>
          {/* Overlay Background */}
          <div className="fixed inset-0 bg-black opacity-50 z-10"></div>

          <div className="fixed inset-0 flex items-center justify-center z-20">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
              <h3 className="text-2xl font-semibold mb-4 text-black">Edit User</h3>
              <form>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    id="name"
                    type="text"
                    value={editingUserData.name || ""}
                    onChange={(e) => setEditingUserData({ ...editingUserData, name: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">Nickname</label>
                  <input
                    id="nickname"
                    type="text"
                    value={editingUserData.nickname || ""}
                    onChange={(e) => setEditingUserData({ ...editingUserData, nickname: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">LinkedIn</label>
                  <input
                    id="linkedin"
                    type="text"
                    value={editingUserData.linkedin || ""}
                    onChange={(e) => setEditingUserData({ ...editingUserData, linkedin: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="github" className="block text-sm font-medium text-gray-700">GitHub</label>
                  <input
                    id="github"
                    type="text"
                    value={editingUserData.github || ""}
                    onChange={(e) => setEditingUserData({ ...editingUserData, github: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="points" className="block text-sm font-medium text-gray-700">Points</label>
                  <input
                    id="points"
                    type="number"
                    value={editingUserData.points || ""}
                    onChange={(e) => setEditingUserData({ ...editingUserData, points: Number(e.target.value) })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex space-x-4">
                  <Button
                    onClick={handleSaveUser}
                    className="px-4 py-2 bg-[#38a169] text-white rounded-md hover:bg-[#2f855a]"
                  >
                    Save
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setEditingUserId(null)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* Form Edit Image with Overlay */}
      {editingImageId && (
        <>
          {/* Overlay Background */}
          <div className="fixed inset-0 bg-black opacity-50 z-10"></div>

          <div className="fixed inset-0 flex items-center justify-center z-20">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
              <h3 className="text-2xl font-semibold mb-4 text-black">Edit Image</h3>
              <form>
                <div className="mb-4">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    id="title"
                    type="text"
                    value={editingImageData.title || ""}
                    onChange={(e) => setEditingImageData({ ...editingImageData, title: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                  <input
                    id="description"
                    type="text"
                    value={editingImageData.description || ""}
                    onChange={(e) => setEditingImageData({ ...editingImageData, description: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex space-x-4">
                  <Button
                    onClick={handleSaveImage}
                    className="px-4 py-2 bg-[#38a169] text-white rounded-md hover:bg-[#2f855a]"
                  >
                    Save
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setEditingImageId(null)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}