import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import ChessBoard from '../models/ChessBoard';

// Get all chess boards for a user
export const getChessBoards = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const chessBoards = await ChessBoard.find({ userId: req.user._id })
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalBoards = await ChessBoard.countDocuments({ userId: req.user._id });

    res.status(200).json({
      success: true,
      message: 'Chess boards retrieved successfully',
      data: {
        chessBoards,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalBoards / limit),
          totalBoards,
          hasNext: page < Math.ceil(totalBoards / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get chess boards error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving chess boards'
    });
  }
};

// Get a specific chess board
export const getChessBoard = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const { boardId } = req.params;

    const chessBoard = await ChessBoard.findOne({
      _id: boardId,
      userId: req.user._id
    });

    if (!chessBoard) {
      res.status(404).json({
        success: false,
        message: 'Chess board not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Chess board retrieved successfully',
      data: { chessBoard }
    });
  } catch (error) {
    console.error('Get chess board error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving chess board'
    });
  }
};

// Create a new chess board
export const createChessBoard = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
      return;
    }

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const { name, fen, gameState, pgn } = req.body;

    const chessBoard = new ChessBoard({
      userId: req.user._id,
      name,
      fen: fen || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      gameState: gameState || {
        fen: fen || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        turn: 'w',
        castling: 'KQkq',
        enPassant: '-',
        halfMove: 0,
        fullMove: 1
      },
      pgn: pgn || '',
      analysisResults: [],
      gameHistory: []
    });

    await chessBoard.save();

    res.status(201).json({
      success: true,
      message: 'Chess board created successfully',
      data: { chessBoard }
    });
  } catch (error) {
    console.error('Create chess board error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating chess board'
    });
  }
};

// Update a chess board
export const updateChessBoard = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
      return;
    }

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const { boardId } = req.params;
    const updateData = req.body;

    const chessBoard = await ChessBoard.findOneAndUpdate(
      { _id: boardId, userId: req.user._id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!chessBoard) {
      res.status(404).json({
        success: false,
        message: 'Chess board not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Chess board updated successfully',
      data: { chessBoard }
    });
  } catch (error) {
    console.error('Update chess board error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating chess board'
    });
  }
};

// Delete a chess board
export const deleteChessBoard = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const { boardId } = req.params;

    const chessBoard = await ChessBoard.findOneAndDelete({
      _id: boardId,
      userId: req.user._id
    });

    if (!chessBoard) {
      res.status(404).json({
        success: false,
        message: 'Chess board not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Chess board deleted successfully'
    });
  } catch (error) {
    console.error('Delete chess board error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting chess board'
    });
  }
};

// Add analysis result to a chess board
export const addAnalysisResult = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
      return;
    }

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const { boardId } = req.params;
    const { bestMove, evaluation, principalVariation, depth } = req.body;

    const chessBoard = await ChessBoard.findOne({
      _id: boardId,
      userId: req.user._id
    });

    if (!chessBoard) {
      res.status(404).json({
        success: false,
        message: 'Chess board not found'
      });
      return;
    }

    chessBoard.analysisResults.push({
      bestMove,
      evaluation,
      principalVariation,
      depth,
      timestamp: new Date()
    });

    await chessBoard.save();

    res.status(200).json({
      success: true,
      message: 'Analysis result added successfully',
      data: { chessBoard }
    });
  } catch (error) {
    console.error('Add analysis result error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error adding analysis result'
    });
  }
};
