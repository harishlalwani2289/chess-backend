import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User, { IUser } from '../models/User';

// Debug: Check if OAuth environment variables are loaded
console.log('🔐 OAuth Environment Variables:');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Missing');
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Missing');
console.log('SESSION_SECRET:', process.env.SESSION_SECRET ? 'Set' : 'Missing');

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: process.env.NODE_ENV === 'production' 
    ? `${process.env.BACKEND_URL || 'https://your-backend-domain.com'}/api/oauth/google/callback`
    : '/api/oauth/google/callback'
}, async (accessToken: string, refreshToken: string, profile: any, done: any) => {
  try {
    // Check if user already exists with this Google ID
    let user = await User.findOne({ 'providers.google.id': profile.id });
    
    if (user) {
      return done(null, user);
    }
    
    // Check if user exists with same email
    user = await User.findOne({ email: profile.emails?.[0]?.value });
    
    if (user) {
      // Add Google provider to existing user
      user.providers.google = {
        id: profile.id,
        email: profile.emails?.[0]?.value || ''
      };
      if (profile.photos?.[0]?.value && !user.avatar) {
        user.avatar = profile.photos[0].value;
      }
      await user.save();
      return done(null, user);
    }
    
    // Create new user
    const newUser = new User({
      email: profile.emails?.[0]?.value,
      name: profile.displayName || profile.name?.givenName || 'User',
      avatar: profile.photos?.[0]?.value,
      providers: {
        google: {
          id: profile.id,
          email: profile.emails?.[0]?.value || ''
        }
      }
    });
    
    await newUser.save();
    return done(null, newUser);
  } catch (error) {
    return done(error, undefined);
  }
}));

// GitHub OAuth Strategy
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    callbackURL: process.env.NODE_ENV === 'production' 
      ? `${process.env.BACKEND_URL || 'https://your-backend-domain.com'}/api/oauth/github/callback`
      : '/api/oauth/github/callback'
}, async (accessToken: string, refreshToken: string, profile: any, done: any) => {
  try {
    // Check if user already exists with this GitHub ID
    let user = await User.findOne({ 'providers.github.id': profile.id });
    
    if (user) {
      return done(null, user);
    }
    
    // Check if user exists with same email
    const email = profile.emails?.[0]?.value;
    if (email) {
      user = await User.findOne({ email });
      
      if (user) {
        // Add GitHub provider to existing user
        user.providers.github = {
          id: profile.id,
          email: email
        };
        if (profile.photos?.[0]?.value && !user.avatar) {
          user.avatar = profile.photos[0].value;
        }
        await user.save();
        return done(null, user);
      }
    }
    
    // Create new user
    const newUser = new User({
      email: email || `${profile.username}@github.local`,
      name: profile.displayName || profile.username || 'GitHub User',
      avatar: profile.photos?.[0]?.value,
      providers: {
        github: {
          id: profile.id,
          email: email || ''
        }
      }
    });
    
    await newUser.save();
    return done(null, newUser);
  } catch (error) {
    return done(error, undefined);
  }
}));
}

// Serialize user for session
passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
