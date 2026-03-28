import { Router } from "express"
import {login,register} from "../controllers/userController.js"
import upload from "../services/cloudinary.js"; 
const router=Router()
router.post('/login',login)
router.post('/register', upload.single('img'),register)
export default router