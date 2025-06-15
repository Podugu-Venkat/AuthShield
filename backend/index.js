import express from 'express';
import { connectDB } from './db/connectDB.js';
import authRoutes from './routes/auth.route.js';
import dotenv from 'dotenv';
const app=express();
dotenv.config();
app.get('/', (req, res) => {
    res.send('Hello, World!');
}   );
app.use('/api/auth',authRoutes);
app.listen(3000, () => {
    connectDB(); 
    console.log('Server is running on port 3000');
});
//mongodb+srv://venkatpodugu09:e57lEEoGOB0V6sBj@cluster0.chjbdml.mongodb.net/