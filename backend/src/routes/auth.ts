// backend/src/routes/auth.ts
import express, {Request, Response} from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { email, password, name } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hash, name });
  res.json({ token: jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret') });
});

router.post('/login', async (req:Request, res:Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ token: jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret') });
});

export default router;