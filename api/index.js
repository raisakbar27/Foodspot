import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routers/user.router.js';
import authRouter from './routers/auth.route.js';
dotenv.config();

mongoose.connect(process.env.MONGODB).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

const app = express();

app.use(express.json());

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

app.get('/test', (req, res) => {
    res.send('Welcome to the API');
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);