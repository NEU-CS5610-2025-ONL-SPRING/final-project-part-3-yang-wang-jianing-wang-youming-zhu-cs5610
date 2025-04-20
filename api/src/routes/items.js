import express from "express";
import { PrismaClient } from "@prisma/client";
import requireAuth from "../middleware/requireAuth.js";
import axios from "axios";
import multer from "multer";
import streamifier from "streamifier";
import cloudinary from "../utils/cloudinary.js";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();
const prisma = new PrismaClient();

// Helper function to get rating using Google Places API
async function getPlaceRating(placeName) {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;

    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/textsearch/json",
      {
        params: {
          query: placeName,
          key: apiKey,
        },
      }
    );

    const result = response.data.results[0];
    return result?.rating || null;
  } catch (error) {
    console.error("Error fetching place rating:", error.message);
    return null;
  }
}

// GET all items (public)
router.get("/", async (req, res) => {
  const userId = parseInt(req.query.userId);
  try {
    const items = await prisma.item.findMany({
      where: userId ? { userId } : {}, // filter by userId if provided
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        description: true,
        imageUrl: true,
        featuredPlace: true,
        rating: true,
        createdAt: true,
        likeCount: true,     // ✅ 
        dislikeCount: true,  // ✅ 
        userId: true,
      },
    });
    res.json(items);
  } catch (err) {
    console.error("Error fetching items:", err);
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

// POST a new item (requires login)
router.post("/", requireAuth, upload.single("image"), async (req, res) => {
  const { name, description, featuredPlace } = req.body;

  if (!name || !description) {
    return res.status(400).json({ error: "Name and description are required" });
  }

  try {
    // ✅ Step 1: upload images to Cloudinary
    let imageUrl = null;

    if (req.file) {
      const streamUpload = (buffer) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream((err, result) => {
            if (err) return reject(err);
            resolve(result);
          });
          streamifier.createReadStream(buffer).pipe(stream);
        });

      const result = await streamUpload(req.file.buffer);
      imageUrl = result.secure_url;
    }

    // ✅ Step 2: get google rating
    const rating = featuredPlace
      ? await getPlaceRating(featuredPlace)
      : null;

    // ✅ Step 3: create item in database
    const newItem = await prisma.item.create({
      data: {
        name,
        description,
        imageUrl, // Cloudinary URL
        featuredPlace,
        rating,
        userId: req.userId,
      },
    });

    res.status(201).json(newItem);
  } catch (err) {
    console.error("❌ Error creating item:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


// GET single post by ID
router.get("/:id", async (req, res) => {
  const postId = parseInt(req.params.id);

  if (isNaN(postId)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    const post = await prisma.item.findUnique({
      where: { id: postId },
    });

    if (!post) return res.status(404).json({ error: "Post not found" });

    res.json(post);
  } catch (err) {
    console.error("Error fetching post:", err);
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

// Delete post by ID (requires login)
router.delete("/:id", requireAuth, async (req, res) => {
  const postId = parseInt(req.params.id);

  try {
    const post = await prisma.item.findUnique({ where: { id: postId } });

    // authrorization check
    if (!post || post.userId !== req.userId) {
      return res.status(403).json({ error: "Not authorized to delete this post" });
    }
    await prisma.like.deleteMany({ where: { itemId: postId } });

    await prisma.item.delete({ where: { id: postId } });

    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    console.error("❌ Failed to delete post:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


export default router;
