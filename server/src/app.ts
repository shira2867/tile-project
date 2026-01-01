import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import tileRoutes from './routes/tileRoute.js'; 
import userRoutes from './routes/userRoute.js'; 
import cookieParser from "cookie-parser";


dotenv.config();
const app = express();
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,               
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
const PORT = process.env.PORT || 3000;
app.use(cookieParser());

app.use(express.json()); 
app.use('/tiles', tileRoutes);
app.use('/users',userRoutes)

mongoose.connect(process.env.MONGO_URI!, {
  dbName: 'tiles' 
}) .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});