import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import itemsRoutes from "./routes/items.js";
import searchItemsRoutes from "./routes/search_items.js";
import placesRoutes from "./routes/places.js";


dotenv.config();
const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/items", itemsRoutes);
app.use("/search", searchItemsRoutes);
app.use("/places", placesRoutes);

app.get("/ping", (req, res) => res.json({ message: "pong" }));

// make a get endpoint for the search (searchquery as a parameter)

app.listen(8000, () => console.log("Server running on http://localhost:8000"));

