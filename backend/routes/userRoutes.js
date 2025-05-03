import express from 'express';
import { registerUser, loginUser, toggleFavorite, getUserFavorites } from '../controllers/userController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/favorites', protect, toggleFavorite);
router.get('/favorites', protect, getUserFavorites);

export default router;
