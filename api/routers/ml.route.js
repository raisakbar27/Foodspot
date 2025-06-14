import express from 'express';
import * as mlController from '../controllers/ml.controller.js';

const router = express.Router();

// Route untuk mendapatkan rekomendasi dari model ML
router.get('/recommendations', mlController.getRecommendations);

export default router;