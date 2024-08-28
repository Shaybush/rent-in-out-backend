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

const router = express();

/**
 * @swagger
 * /categories:
 *   get:
 *     tags: ['Categories operations']
 *     description: Get categories list
 *     parameters:
 *      - in: query
 *        name: sort
 *        schema:
 *          type: number
 *          minimum: 1
 *        description: Sort by field name.
 *      - in: query
 *        name: reverse
 *        schema:
 *          type: string
 *        description: Reverse the data.
 *     responses:
 *       200:
 *         description: Returns the categories filtered list
 *         content:
 *           application/json:
 *               schema:
 *                  type: object
 *                  properties:
 *                      data:
 *                          type: array
 *                          items:
 *                             $ref: "#/components/schemas/category"
 *       500:
 *         description: Internal server error
 */
router.get('/', getCategorylist);

/**
 * @swagger
 * /categories/search:
 *   get:
 *     tags: ['Categories operations']
 *     description: Get categories list
 *     security:
 *       - apiKeyAuth: []   # This line adds the x-api-key to this specific route
 *     parameters:
 *      - in: query
 *        name: perPage
 *        schema:
 *          type: number
 *          minimum: 10
 *        description: How many categories per page.
 *      - in: query
 *        name: page
 *        schema:
 *          type: string
 *        description: Selected page.
 *     responses:
 *       200:
 *         description: Returns the categories filtered list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/category"
 *       500:
 *         description: Internal server error
 */
router.get('/search', authAdmin, searchCategories);

router.get('/count', countCategories);

router.post('/', authAdmin, categoryControl, addCategory);

router.put('/:idEdit', authAdmin, categoryControl, editCategory);

router.delete('/:idDel', authAdmin, deleteCategory);

export default router;
