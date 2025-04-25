// backend/src/models/Standup.ts
import { Schema, model, Types } from 'mongoose';

const standupSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User' },
  date: { type: String, required: true }, // YYYY-MM-DD
  yesterday: String,
  today: String,
  blockers: String,
}, { timestamps: true });

standupSchema.index({ userId: 1, date: 1 }, { unique: true });

export default model('Standup', standupSchema);