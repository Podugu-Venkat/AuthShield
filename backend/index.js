import express from 'express';
import { connectDB } from './db/connectDB.js';
import authRoutes from './routes/auth.route.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
const app=express();
dotenv.config();
app.get('/', (req, res) => {
    res.send('Hello, World!!');
}   );
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173', // Adjust the origin as needed
    credentials: true, // Allow cookies to be sent with requests
}));
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth',authRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    connectDB(); 
    console.log('Server is running on port :',PORT);
});
//mongodb+srv://venkatpodugu09:e57lEEoGOB0V6sBj@cluster0.chjbdml.mongodb.net/