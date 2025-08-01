import { Router } from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile
} from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';
import {
  validateRegistration,
  validateLogin,
  validateProfileUpdate
} from '../middleware/validation';

const router = Router();

// Public routes
router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);

// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, validateProfileUpdate, updateProfile);

export default router;
