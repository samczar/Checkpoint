// backend/src/routes/standups.ts
import express from 'express';
import Standup from '../models/Standup';
import jwt from 'jsonwebtoken';

const router = express.Router();

function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.sendStatus(401);
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    next();
  } catch {
    res.sendStatus(401);
  }
}

// Create or update today's standup
router.post('/', auth, async (req, res) => {
  const { yesterday, today, blockers } = req.body;
  const date = new Date().toISOString().slice(0, 10);
  const standup = await Standup.findOneAndUpdate(
    { userId: req.user.id, date },
    { yesterday, today, blockers },
    { upsert: true, new: true }
  );
  res.json(standup);
});

// Get my standup history
router.get('/mine', auth, async (req, res) => {
  const standups = await Standup.find({ userId: req.user.id }).sort({ date: -1 });
  res.json(standups);
});

// Get latest standup from each user
router.get('/team', auth, async (req, res) => {
  // For demo: get latest standup per user
  const pipeline = [
    { $sort: { date: -1 } },
    { $group: { _id: "$userId", standup: { $first: "$$ROOT" } } },
    { $replaceRoot: { newRoot: "$standup" } }
  ];
  const standups = await Standup.aggregate(pipeline);
  res.json(standups);
});

export default router;