// backend/src/models/User.ts
import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  email: { type: String, unique: true },
  password: String,
  name: String,
  avatarUrl: String,
}, { timestamps: true });

export default model('User', userSchema);