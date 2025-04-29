// backend/src/routes/auth.ts
import express, { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { signup } from "../controllers/authController";

const router = express.Router();

router.post("/signup", signup);

router.get("/me", async (req: Request, res: any) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as {
      id: string;
    };
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", async (req: Request, res: any) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ error: "Invalid email or password" });
  res.json({
    token: jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret"),
  });
});

// Add this route to get all users (excluding passwords)
router.get("/users", async (req: Request, res: Response) => {
    try {
      const users = await User.find().select("-password");
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  // Get a single user by ID (excluding password)
router.get("/user/:id", async (req: Request, res: any) => {
    try {
      const user = await User.findById(req.params.id).select("-password");
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

export default router;
