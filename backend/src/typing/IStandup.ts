import { Document, Types } from 'mongoose';

export interface IStandup extends Document {
  userId: Types.ObjectId;
  date: string;
  blockers?: string;
  yesterday: string;
  today: string;
}