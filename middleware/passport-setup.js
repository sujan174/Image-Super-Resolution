// Developed by Sujan H

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const userModel = require('../models/user');

// Configure Passport Google OAuth strategy for social authentication
passport.use(
  new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/user/auth/google/callback',
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Find existing user or create new one from Google profile
      let user = await userModel.findOne({ email: profile.emails[0].value });

      if (user) {
        return done(null, user);
      }

      const newUser = await userModel.create({
        name: profile.displayName,
        email: profile.emails[0].value,
        password: 'google-user',
      });
      return done(null, newUser);
    } catch (error) {
      return done(error, null);
    }
  }),
);

module.exports = passport;
