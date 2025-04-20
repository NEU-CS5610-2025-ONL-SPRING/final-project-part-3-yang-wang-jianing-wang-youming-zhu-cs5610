import express from "express";
import { PrismaClient } from "@prisma/client";
import requireAuth from "../middleware/requireAuth.js";
import axios from "axios";

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
  try {
    const items = await prisma.item.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json(items);
  } catch (err) {
    console.error("Error fetching items:", err);
    res.status(500).json({ error: "Failed to fetch items" });
  }
});



// POST a new item (requires login)
router.post("/", requireAuth, async (req, res) => {
  const { name, description, imageUrl, featuredPlace } = req.body;

  // Basic validation
  if (!name || !description) {
    return res.status(400).json({ error: "Name and description are required" });
  }

  try {
    // Lookup Google rating if featuredPlace is provided
    const rating = featuredPlace
      ? await getPlaceRating(featuredPlace)
      : null;
    // debugging
    console.log("📍 Featured Place:", featuredPlace);
    console.log("🔍 Rating from Google API:", rating);


    // Save post with Google rating (if found)
    const newItem = await prisma.item.create({
      data: {
        name,
        description,
        imageUrl,
        featuredPlace,
        rating,
        userId: req.userId, // Extracted from token in requireAuth middleware
      },
    });

    res.status(201).json(newItem);
  } catch (err) {
    console.error("Error creating item:", err);
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


export default router;
