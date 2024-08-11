import express, { NextFunction, Request, Response } from 'express';
import { categoryCtrl } from '../controllers/categoryCtrl';
import { authAdmin } from '../middlewares/auth';
import { CustomRequest } from '../@types/request.types';
import { SortOrder } from 'mongoose';
import { CategoryModel } from '../models/categoryModel';
import { select } from '../helpers/userHelper';
const router = express.Router();

// TODO - req.tokenData._id - error: tokenData does not exist...
// how to declare tokenData ?
// Option 1 - I used CustomRequest to extend Request
// what else ? option 1 doesn't work well...
router.get('/', categoryCtrl.getCategorylist);
router.post('/', authAdmin, categoryCtrl.addCategory);
router.put('/:idEdit', authAdmin, categoryCtrl.editCategory);
router.delete('/:idDel', authAdmin, categoryCtrl.deleteCategory);
router.get('/count', categoryCtrl.count);
router.get('/search', authAdmin, categoryCtrl.search);

export default router;
