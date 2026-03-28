import 'dotenv/config';
import dns from "node:dns"
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import "./services/passport.js"
import authRoutes from "./Routers/authRouter.js"
import UserRouter from "./Routers/userRouter.js"
const app = express();
app.use(express.json());
app.use(passport.initialize());
app.use('/', authRoutes);
app.use('/auth', UserRouter)
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB');
        app.listen(3000, () => {
            console.log(`🚀 Server is running on http://localhost:3000`);
        });
    })
    .catch((err) => {
        console.error('❌ Database connection error:', err);
    });