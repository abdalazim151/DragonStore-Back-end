import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import passport from 'passport';
import User from "../models/user.js"
import { generateToken, generateRefreshToken } from "./auth.js"
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ googleId: profile.id });
            let token, refreshToken
            if (user) {
                token = generateToken(user)
                refreshToken = generateRefreshToken(user)
                return done(null, { token, refreshToken });
            }
            user = await User.create({
                googleId: profile.id,
                firstName: profile.name.givenName,      // الاسم الأول من جوجل
                lastName: profile.name.familyName,      // الاسم الأخير من جوجل
                email: profile.emails[0].value,         // الإيميل الأساسي
                img: profile.photos[0].value,           // صورة البروفايل
                isVerified: profile.emails[0].verified, // هل إيميله متفعل عند جوجل؟

            });
            token = generateToken(user)
            refreshToken = generateRefreshToken(user)
            return done(null, { token, refreshToken });
        } catch (err) {
            return done(err, null);
        }
    }
));