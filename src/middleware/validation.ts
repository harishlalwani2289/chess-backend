import { body, param } from 'express-validator';

// User registration validation
export const validateRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces')
];

// User login validation
export const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Profile update validation
export const validateProfileUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces')
];

// Chess board creation validation
export const validateChessBoardCreation = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Board name must be between 1 and 100 characters'),
  body('fen')
    .optional()
    .isString()
    .withMessage('FEN must be a string'),
  body('gameState')
    .optional()
    .isObject()
    .withMessage('Game state must be an object'),
  body('pgn')
    .optional()
    .isString()
    .withMessage('PGN must be a string')
];

// Chess board update validation
export const validateChessBoardUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Board name must be between 1 and 100 characters'),
  body('fen')
    .optional()
    .isString()
    .withMessage('FEN must be a string'),
  body('gameState')
    .optional()
    .isObject()
    .withMessage('Game state must be an object'),
  body('pgn')
    .optional()
    .isString()
    .withMessage('PGN must be a string'),
  body('analysisResults')
    .optional()
    .isArray()
    .withMessage('Analysis results must be an array'),
  body('gameHistory')
    .optional()
    .isArray()
    .withMessage('Game history must be an array')
];

// Analysis result validation
export const validateAnalysisResult = [
  body('bestMove')
    .notEmpty()
    .isString()
    .withMessage('Best move is required and must be a string'),
  body('evaluation')
    .isNumeric()
    .withMessage('Evaluation must be a number'),
  body('principalVariation')
    .optional()
    .isString()
    .withMessage('Principal variation must be a string'),
  body('depth')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Depth must be a positive integer')
];

// MongoDB ObjectId validation
export const validateObjectId = [
  param('boardId')
    .isMongoId()
    .withMessage('Invalid board ID')
];
