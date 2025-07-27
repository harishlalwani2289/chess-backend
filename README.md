# Chess Backend API

Backend API for Chess Game with User Authentication and Data Persistence

## Features

- 🔐 **User Authentication** - JWT-based auth with registration/login
- 🏁 **Chess Board Management** - Create, update, delete chess boards
- 📊 **Analysis Storage** - Store and retrieve chess analysis results
- 🔄 **Cross-Device Sync** - Access your data from any device
- 🛡️ **Security** - Rate limiting, CORS, input validation
- 📱 **RESTful API** - Clean and consistent API design

## Tech Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, Rate Limiting, CORS
- **Validation**: Express Validator

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Chess Boards
- `GET /api/chess-boards` - Get all user's chess boards
- `GET /api/chess-boards/:boardId` - Get specific chess board
- `POST /api/chess-boards` - Create new chess board
- `PUT /api/chess-boards/:boardId` - Update chess board
- `DELETE /api/chess-boards/:boardId` - Delete chess board
- `POST /api/chess-boards/:boardId/analysis` - Add analysis result

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   - Copy `.env.example` to `.env`
   - Update MongoDB connection string
   - Set JWT secret

3. **Development**
   ```bash
   npm run dev
   ```

4. **Production Build**
   ```bash
   npm run build
   npm start
   ```

## Database Schema

### User Model
```typescript
{
  email: string;
  password: string; // hashed
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Chess Board Model
```typescript
{
  userId: ObjectId;
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
  createdAt: Date;
  updatedAt: Date;
}
```

## Authentication

All chess board endpoints require authentication. Include JWT token in header:

```
Authorization: Bearer <your-jwt-token>
```

## License

MIT
