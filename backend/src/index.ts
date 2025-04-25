// backend/src/index.ts
import express, {Request, Response} from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI || '', { dbName: 'checkpoint' })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

  app.get('/', (req: Request, res: Response) => {
    try {
      res.status(200).json({
        status: 'success',
        message: 'Checkpoint API running!'
      });
    } catch (error) {
      console.error('Error in root endpoint:', error);
      res.status(500).json({ 
        status: 'error', 
        message: 'Internal server error' 
      });
    }
  });

app.listen(4000, () => console.log('Server running on port 4000'));