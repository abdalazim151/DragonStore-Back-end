import { Router } from 'express';
import { addToFavorite, removeFromFavorite, getMyFavorites } from '../controllers/favouriteListcontroller.js';
import { auth } from '../middleware/authMiddleware.js'; 
const router = Router();

router.get('/', auth, getMyFavorites);
router.post('/:productId', auth, addToFavorite);
router.delete('/:productId', auth, removeFromFavorite);

export default router;