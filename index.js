import "dotenv/config";
import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import cors from "cors";
import { apiReference } from '@scalar/express-api-reference';
import swaggerJsdoc from 'swagger-jsdoc';

// Imports الخاصة بمشروعك
import "./services/passport.js"
import { appError } from "./utils/appError.js";
import { globalError } from "./middleware/globalError.js";
import authRoutes from "./Routers/authRouter.js";
import UserRouter from "./Routers/userRouter.js";
import cartRouter from "./Routers/cartRouter.js";
import productRouter from "./Routers/productRouter.js";
import { reviewRouter } from "./Routers/reviewRouter.js";
import { commentRouter } from "./Routers/commentRouter.js";
import favouriteRouter from "./Routers/favouriteRouter.js"
import Seller from "./Routers/sellerRouter.js"

const app = express();

// --- إعدادات Swagger / OpenAPI ---
const swaggerOptions = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'E-Commerce API Documentation',
      version: '1.0.0',
      description: 'واجهة اختبار الـ APIs الخاصة بمشروعك (بديل سواجر)',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  // تأكد أن المسار هنا يطابق مكان ملفات الـ Routers عندك
  apis: ["./Routers/*.js"],
};

const specs = swaggerJsdoc(swaggerOptions);

// --- Connection to MongoDB ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(3000, () => {
      console.log(`🚀 Server is running on http://localhost:3000`);
      console.log(`📑 API Docs available at http://localhost:3000/reference`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err);
  });

// --- Middlewares ---
const frontendOrigin = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(
  cors({
    origin: [frontendOrigin, /^http:\/\/localhost:\d+$/],
    credentials: true,
  })
);
app.use(express.json());
app.use(passport.initialize());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// --- Scalar API Reference (المكان اللي هيظهر فيه الشكل الجديد) ---
app.use(
  '/reference',
  apiReference({
    theme: 'purple', // ممكن تغير الثيم لـ 'blue' أو 'night' أو 'fast'
    spec: {
      content: specs,
    },
  })
);

// --- Routes ---
app.use('/favourites', favouriteRouter);
app.use("/", authRoutes);
app.use("/auth", UserRouter);
app.use("/api/products", productRouter);
app.use("/review", reviewRouter);
app.use("/comments", commentRouter);
app.use("/cart", cartRouter);
app.use('/seller', Seller);

// --- Error Handling ---
app.all(/.*/, (req, res, next) => {
  next(new appError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalError);