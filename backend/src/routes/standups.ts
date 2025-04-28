import express, { Request, Response, NextFunction } from 'express';
import Standup from '../models/Standup';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import {auth} from '../middleware/auth';
import { PipelineStage } from 'mongoose'; // important for typing
import { IStandup } from '../typing/IStandup';

const router = express.Router();

// Create or update today's standup
router.post('/', auth, async (req, res) => {
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
router.get('/mine', auth, async (req: Request, res: Response) => {
  const user = (req as any).user;
  const standups = await Standup.find({ userId: user._id }).sort({ date: -1 });
  res.json(standups);
});

// Get latest standup from each user
router.get('/team', auth, async (req, res) => {
  const pipeline: PipelineStage[] = [
    { $sort: { date: -1 as -1 } },
    { $group: { _id: "$userId", standup: { $first: "$$ROOT" } } },
    { $replaceRoot: { newRoot: "$standup" } },
     // Populate user info
     {
      $lookup: {
        from: "users", // MongoDB collection name (usually lowercase plural)
        localField: "userId",
        foreignField: "_id",
        as: "user",
        pipeline: [
          { $project: { name: 1, email: 1 } } // Only these fields
        ]
      }
    },
    // Unwind the user array to a single object
    { $unwind: "$user" }
  ];

  try {
    const standups = await Standup.aggregate<IStandup>(pipeline);
    res.json(standups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;