import { Router } from "express";
import passport from "passport"; 
import { Resolve } from "../controllers/authController.js";

const router = Router();

router.get('/auth/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        prompt: 'select_account' 
    })
);
router.get('/auth/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    Resolve
);
export default router;