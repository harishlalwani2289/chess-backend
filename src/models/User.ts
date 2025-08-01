import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// Interface for OAuth provider data
export interface IOAuthProvider {
  id: string;
  email: string;
}

// Interface for User document
export interface IUser extends Document {
  email: string;
  password?: string; // Optional for OAuth users
  name: string;
  avatar?: string;
  providers: {
    google?: IOAuthProvider;
    github?: IOAuthProvider;
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// User schema
const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: function(this: IUser) {
      // Password is required only if no OAuth providers are set
      return !this.providers?.google && !this.providers?.github;
    },
    minlength: [6, 'Password must be at least 6 characters long']
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  avatar: {
    type: String,
    required: false
  },
  providers: {
    google: {
      id: { type: String },
      email: { type: String }
    },
    github: {
      id: { type: String },
      email: { type: String }
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  if (!this.password) return false; // OAuth users don't have passwords
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

export default mongoose.model<IUser>('User', userSchema);
