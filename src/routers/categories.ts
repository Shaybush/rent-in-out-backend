import express from 'express';
import {
	addCategory,
	countCategories,
	deleteCategory,
	editCategory,
	getCategorylist,
	searchCategories,
} from '../services/categoryService';
import { authAdmin } from '../middlewares/auth';
import { categoryControl } from '../controllers/categoryControl';
const router = express.Router();

router.get('/', getCategorylist);
router.get('/search', authAdmin, searchCategories);
router.get('/count', countCategories);

router.post('/', authAdmin, categoryControl, addCategory);

router.put('/:idEdit', authAdmin, categoryControl, editCategory);

router.delete('/:idDel', authAdmin, deleteCategory);

export default router;
