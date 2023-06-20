import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import paymentRoutes from './routes/paymentRoutes';
import { initLapinou } from './lapinou';

dotenv.config();
const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI as string, { useNewUrlParser: true, useUnifiedTopology: true } as any)
  .then(() => console.log('Successfully connected to MongoDB.'))
  .catch((error) => console.log('Failed to connect to MongoDB.', error));

// Set JSON format for HTTP requests
app.use(express.json());

// Create endpoint
app.get('/', (req, res) => {res.status(200).json({ response: true });});
app.use('/payment', paymentRoutes);
initLapinou();

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server is running...'));

export default app;
