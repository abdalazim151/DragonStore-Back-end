import { Router } from "express";
import { auth, allowedTo } from "../middleware/authMiddleware.js";
import {Get,Response} from "../controllers/sellerController.js"
const router = Router()
router.get('/',auth,allowedTo("seller"),Get)
router.patch('/:id/:response', auth,allowedTo("seller"),Response )

export  default router
