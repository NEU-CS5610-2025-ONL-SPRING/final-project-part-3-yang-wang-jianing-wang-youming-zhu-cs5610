import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// search_items.js
router.get("/", async (req, res) => {
    const { place } = req.query;

    console.log("Received search query:", place);
    if (!place || place.trim() === "") {
        return res.status(400).json({ error: "Search query is required" });
    }

    try {
        const allPosts = await prisma.item.findMany({
            orderBy: { createdAt: "desc" },
        });

        const filtered = allPosts.filter((post) =>
            post.featuredPlace?.toLowerCase().includes(place.toLowerCase())
        );

        console.log(`Found ${filtered.length} posts matching the query`);
        res.json(filtered);
    } catch (err) {
        console.error("Error searching posts:", err);
        res.status(500).json({ error: "Failed to search posts" });
    }
});

export default router;

