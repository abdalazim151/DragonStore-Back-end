import 'dotenv/config';
import dns from "node:dns"
dns.setServers(["8.8.8.8", "8.8.4.4"]);
import {appError} from "./utils/appError.js"
import {globalError}  from './middleware/globalError.js';
import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
// import "./services/passport.js"
import authRoutes from "./Routers/authRouter.js"
import UserRouter from "./Routers/userRouter.js"
const app = express();

// require('dotenv').config(); 

// const mongoose = require('mongoose');
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

app.use(express.json());
app.use(passport.initialize());
app.use('/', authRoutes);
app.use('/auth', UserRouter)
app.all(/.*/, (req, res, next) => {
    next(new appError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalError)



