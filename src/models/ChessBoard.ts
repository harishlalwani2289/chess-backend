import mongoose, { Document, Schema } from 'mongoose';

// Interface for Chess Board document
export interface IChessBoard extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  fen: string;
  gameState: {
    fen: string;
    turn: 'w' | 'b';
    castling: string;
    enPassant: string;
    halfMove: number;
    fullMove: number;
  };
  analysisResults: Array<{
    bestMove: string;
    evaluation: number;
    principalVariation: string;
    depth: number;
    timestamp: Date;
  }>;
  pgn?: string;
  gameHistory: Array<{
    move: string;
    fen: string;
    timestamp: Date;
  }>;
  boardOrientation?: 'white' | 'black';
  createdAt: Date;
  updatedAt: Date;
}

// Chess Board schema
const chessBoardSchema = new Schema<IChessBoard>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  name: {
    type: String,
    required: [true, 'Board name is required'],
    trim: true,
    maxlength: [100, 'Board name cannot exceed 100 characters']
  },
  fen: {
    type: String,
    required: [true, 'FEN is required'],
    default: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
  },
  gameState: {
    fen: {
      type: String,
      required: true,
      default: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    },
    turn: {
      type: String,
      enum: ['w', 'b'],
      required: true,
      default: 'w'
    },
    castling: {
      type: String,
      default: 'KQkq'
    },
    enPassant: {
      type: String,
      default: '-'
    },
    halfMove: {
      type: Number,
      default: 0
    },
    fullMove: {
      type: Number,
      default: 1
    }
  },
  analysisResults: [{
    bestMove: String,
    evaluation: Number,
    principalVariation: String,
    depth: Number,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  pgn: {
    type: String,
    default: ''
  },
  gameHistory: [{
    move: String,
    fen: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  boardOrientation: {
    type: String,
    enum: ['white', 'black'],
    default: 'white'
  }
}, {
  timestamps: true
});

// Index for better query performance
chessBoardSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IChessBoard>('ChessBoard', chessBoardSchema);
