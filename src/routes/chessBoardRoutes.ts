import { Router } from 'express';
import {
  getChessBoards,
  getChessBoard,
  createChessBoard,
  updateChessBoard,
  deleteChessBoard,
  addAnalysisResult
} from '../controllers/chessBoardController';
import { authenticateToken } from '../middleware/auth';
import {
  validateChessBoardCreation,
  validateChessBoardUpdate,
  validateAnalysisResult,
  validateObjectId
} from '../middleware/validation';

const router = Router();

// All routes are protected (require authentication)
router.use(authenticateToken);

// Chess board CRUD routes
router.get('/', getChessBoards);
router.get('/:boardId', validateObjectId, getChessBoard);
router.post('/', validateChessBoardCreation, createChessBoard);
router.put('/:boardId', validateObjectId, validateChessBoardUpdate, updateChessBoard);
router.delete('/:boardId', validateObjectId, deleteChessBoard);

// Analysis routes
router.post('/:boardId/analysis', validateObjectId, validateAnalysisResult, addAnalysisResult);

export default router;
