import { Router } from "express"
import {login,register,getUserById,getUsers} from "../controllers/userController.js"
import upload from "../services/cloudinary.js"; 
const router=Router()
router.post('/login',login)
router.post('/register', upload.single('img'),register)
router.get('/users', getUsers);
router.get('/users/:id', getUserById);

export default router