// backend/src/models/Standup.ts
import { Schema, model, Types } from 'mongoose';
import { IStandup } from '../typing/IStandup';

const standupSchema = new Schema<IStandup>({
  userId: { type: String, ref: 'User', required: true },
  date: { type: String, required: true, unique: true }, // YYYY-MM-DD
  yesterday: { type: String, required: true },
  today: { type: String, required: true },
  blockers: { type: String },
},{ timestamps: true });

standupSchema.index({ userId: 1, date: 1 }, { unique: true });

export default model<IStandup>('Standup', standupSchema);