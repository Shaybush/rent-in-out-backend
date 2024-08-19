import express from 'express';
import {
	addCategory,
	countCategories,
	deleteCategory,
	editCategory,
	getCategorylist,
	searchCategories,
} from '../controllers/categoryCtrl';
import { authAdmin } from '../middlewares/auth';
const router = express.Router();

router.get('/', getCategorylist);
router.post('/', authAdmin, addCategory);
router.put('/:idEdit', authAdmin, editCategory);
router.delete('/:idDel', authAdmin, deleteCategory);
router.get('/count', countCategories);
router.get('/search', authAdmin, searchCategories);

export default router;
