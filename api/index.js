import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routers/user.router.js';
import authRouter from './routers/auth.route.js';
import listRouter from './routers/list.route.js';
import mlRouter from './routers/ml.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// Mendapatkan __dirname di ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

mongoose.connect(process.env.MONGODB).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// API routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/list", listRouter);
app.use("/api/ml", mlRouter);

// Test route
app.get('/api/test', (req, res) => {
    res.send('Welcome to the API');
});

// Serve static files
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});

// Catch-all route for SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});