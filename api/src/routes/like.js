import express from "express";
import { PrismaClient } from "@prisma/client";
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();
const prisma = new PrismaClient();

// like or dislike
router.post("/", requireAuth, async (req, res) => {
    const { itemId, isLike } = req.body;
    const userId = req.userId;

    if (!itemId || typeof isLike !== "boolean") {
        return res.status(400).json({ error: "Missing fields" });
    }

    try {
        const existing = await prisma.like.findUnique({
            where: {
                userId_itemId: {
                    userId,
                    itemId
                }
            }
        });

        if (existing) {
            if (existing.isLike === isLike) {
                await prisma.like.delete({
                    where: { userId_itemId: { userId, itemId } }
                });
            } else {
                await prisma.like.update({
                    where: { userId_itemId: { userId, itemId } },
                    data: { isLike }
                });
            }
        } else {
            await prisma.like.create({
                data: { userId, itemId, isLike }
            });
        }

        // update likeCount and dislikeCount
        const [likeCount, dislikeCount] = await Promise.all([
            prisma.like.count({ where: { itemId, isLike: true } }),
            prisma.like.count({ where: { itemId, isLike: false } })
        ]);

        await prisma.item.update({
            where: { id: itemId },
            data: { likeCount, dislikeCount }
        });
        console.log(`✅ Updated item ${itemId}: likeCount=${likeCount}, dislikeCount=${dislikeCount}`);

        res.json({ likeCount, dislikeCount });
    } catch (err) {
        console.error("Error in like handler:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
