import express from "express";
import { PrismaClient } from "@prisma/client";
import requireAuth from "../middleware/requireAuth.js";
import axios from "axios";

const router = express.Router();
const prisma = new PrismaClient();

// GET locations from all posts
router.get("/", async (req, res) => {
    try {
      const items = await prisma.item.findMany({
        select: {
          featuredPlace: true,
        },
        distinct: ["featuredPlace"]
      });
      res.json(items);
    } catch (err) {
      console.error("Error fetching places:", err);
      res.status(500).json({ error: "Failed to fetch places" });
    }
  });

  export default router;