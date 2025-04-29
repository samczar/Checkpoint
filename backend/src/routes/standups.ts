import express, { Request, Response, NextFunction } from "express";
import Standup from "../models/Standup";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { auth } from "../middleware/auth";
import { PipelineStage } from "mongoose"; // important for typing
import { IStandup } from "../typing/IStandup";
import { Types } from "mongoose"; 

const router = express.Router();

// Create or update today's standup
router.post("/", auth, async (req, res) => {
  const { yesterday, today, blockers } = req.body;
  const user = (req as any).user;
  const date = new Date().toISOString().slice(0, 10);
  const standup = await Standup.findOneAndUpdate(
    { userId: user._id, date },
    { yesterday, today, blockers },
    { upsert: true, new: true }
  );
  res.json(standup);
});

// Get my standup history
router.get("/mine", auth, async (req, res) => {
  const userId = (req as any).user._id;
  const { page = 1, limit = 5, search = "" } = req.query;

  const pageNum = parseInt(page as string, 10) || 1;
  const limitNum = parseInt(limit as string, 10) || 5;

  // Build search filter
  const searchRegex = new RegExp(search as string, "i");
  const filter: any = { userId };

  if (search) {
    filter.$or = [
      { yesterday: searchRegex },
      { today: searchRegex },
      { blockers: searchRegex }
    ];
  }

  try {
    const total = await Standup.countDocuments(filter);
    const standups = await Standup.find(filter)
      .sort({ date: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    res.json({
      standups,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      total
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get latest standup from each user
router.get("/team", auth, async (req, res) => {
  const { date, range, userId } = req.query;
  const pipeline: PipelineStage[] = [];

  // If a date is provided, filter by it
  if (date) {
    pipeline.push({ $match: { date } });
  }

  // If range=week, filter for the last 7 days (including today)
  if (range === "week") {
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 6);
    const todayStr = today.toISOString().slice(0, 10);
    const lastWeekStr = lastWeek.toISOString().slice(0, 10);

    pipeline.push({
      $match: {
        date: { $gte: lastWeekStr, $lte: todayStr },
      },
    });
  }

  // If userId is provided, filter by userId
  if (userId) {
    pipeline.push({
      $match: {
        userId: Array.isArray(userId)
          ? { $in: userId.map(id => new Types.ObjectId(id as string)) }
          : new Types.ObjectId(userId as string),
      },
    });
  }

  // Only group by user if NO filters are applied (default view)
  if (!range && !userId && !date) {
    pipeline.push(
      { $sort: { date: -1 as -1 } },
      { $group: { _id: "$userId", standup: { $first: "$$ROOT" } } },
      { $replaceRoot: { newRoot: "$standup" } }
    );
  } else {
    // For any filter, just sort (do NOT group)
    pipeline.push({ $sort: { date: -1 as -1 } });
  }

  pipeline.push(
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
        pipeline: [
          { $project: { name: 1, email: 1 } },
        ],
      },
    },
    { $unwind: "$user" }
  );

  try {
    const standups = await Standup.aggregate<IStandup>(pipeline);
    res.json(standups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;