import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
    },
    email: {
      type: String,
      required: true,
      index: true, // Menambahkan index untuk pencarian yang lebih cepat berdasarkan email
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
);

// Ekspor model Image
export default mongoose.models.Image || mongoose.model("Image", ImageSchema);