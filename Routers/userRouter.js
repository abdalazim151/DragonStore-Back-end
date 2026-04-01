import { Router } from "express";
import {
        login,
        register,
        getUserById,
        getUsers,
        getTopBuyers,
        getTopSellers
}
        from "../controllers/userController.js";

import upload from "../services/cloudinary.js";
import { auth,allowedTo } from "../middleware/authMiddleware.js";
// import { auth, allowedTo } from "../middleware/authMiddleware.js";

const router = Router();

router.post('/login', login);
router.post('/register', upload.single('img'), register);

// لو عايز تحميهم بعدين:
// router.get('/users', auth, allowedTo('admin'), getUsers);
// router.get('/users/:id', auth, allowedTo('admin'), getUserById);

router.get('/users/top-buyers',auth,allowedTo("admin"), getTopBuyers);
router.get('/users/top-sellers',auth, allowedTo("admin") ,getTopSellers);
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
export default router;