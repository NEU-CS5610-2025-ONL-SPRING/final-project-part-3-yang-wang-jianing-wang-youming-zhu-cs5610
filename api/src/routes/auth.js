import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Middleware to verify JWT token sent by the client
function requireAuth(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.userId; // Attach userId to the request object
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

// Register endpoint
router.post("/register", async (req, res) => {
  const { username, email, password, bio } = req.body;

  try {
    // Validate username format
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({ error: "Invalid username format. Must be 3-20 characters and contain only letters, numbers, or underscores." });
    }

    // Check if username already exists
    const existingUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Validate password format
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ error: "Password must be at least 8 characters long and contain at least one letter and one number." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        bio: bio || null  // Explicitly set bio to null if not provided
      },
    });

    // Generate a JWT token
    const payload = { userId: newUser.user_id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });

    // Set the token as an HTTP-only cookie
    res.cookie("token", token, { httpOnly: true, maxAge: 15 * 60 * 1000 });

    // Send success response
    res.status(201).json({
      user_id: newUser.user_id,
      username: newUser.username,
      email: newUser.email
    });
  } catch (error) {
    console.error("Error during registration:", error); // Log the error for debugging
    res.status(500).json({ error: "An unexpected error occurred during registration." });
  }
});

// Login endpoint
router.post("/login", async (req, res) => {
  const { email, username, password } = req.body;

  if (!password || (!email && !username)) {
    return res.status(400).json({ error: "Email/username and password are required" });
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email || "" },
          { username: username || "" }
        ]
      },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const payload = { userId: user.user_id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
      sameSite: isProduction ? "None" : "Lax",
      secure: isProduction
    });

    res.json({
      user_id: user.user_id,
      username: user.username,
      email: user.email
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Logout endpoint
router.post("/logout", (req, res) => {
  res.clearCookie("token"); // Clear the token cookie
  res.json({ message: "Logged out successfully" }); // Send a success response
});

// Protected route example to verify token and return user info
router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { user_id: req.userId },
      select: { user_id: true, username: true, email: true, bio: true },
    });
    res.json(user);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



// Add interface to check login status
router.get("/check", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.json({ isAuthenticated: false });
    }

    jwt.verify(token, process.env.JWT_SECRET);
    res.json({ isAuthenticated: true });
  } catch (err) {
    res.json({ isAuthenticated: false });
  }
});

// Get current login user ID（using JWT or session middleware）
router.get("/current-user", requireAuth, (req, res) => {
  res.json({ id: req.userId });
});

export default router;