import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import "dotenv/config";
import pool from "../../db.js";
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await pool.query(
          "SELECT * FROM users WHERE google_id = $1",
          [profile.id]
        );

        if (existingUser.rows.length > 0) {
          return done(null, existingUser.rows[0]);
        }

        const email =
          profile.emails && profile.emails[0] ? profile.emails[0].value : null;

        const newUser = await pool.query(
          `INSERT INTO users (username, email, google_id)
           VALUES ($1, $2, $3)
           RETURNING *`,
          [profile.displayName, email, profile.id]
        );

        return done(null, newUser.rows[0]);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    done(null, user.rows[0]);
  } catch (err) {
    done(err, null);
  }
});
