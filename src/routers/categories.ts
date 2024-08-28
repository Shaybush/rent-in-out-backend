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
 *     summary: Must be connected as admin
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
 *      - in: query
 *        name: sort
 *        schema:
 *          type: string
 *        description: Choose the element in the categories to be sorted.
 *      - in: query
 *        name: reverse
 *        schema:
 *          type: string
 *        description: reverse could be 'yes' for asc order or desc default.
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

/**
 * @swagger
 * /categories/count:
 *   get:
 *     tags: ['Categories operations']
 *     description: Get count of categories list
 *     responses:
 *       200:
 *         description: Returns the categories filtered list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: number
 *       500:
 *         description: Internal server error
 */
router.get('/count', countCategories);

/**
 * @swagger
 * /categories:
 *   post:
 *     tags: ['Categories operations']
 *     description: Create new Category
 *     summary: Must be connected as admin
 *     requestBody:
 *        description: User's data
 *        required: true
 *        content:
 *           application/json:
 *               schema:
 *                  type: object
 *                  required: [ "name", "url_name", "info" ]
 *                  properties:
 *                      name:
 *                          type: string
 *                          example: "Myname"
 *                      url_name:
 *                          type: string
 *                          example: "url_name"
 *                      info:
 *                          type: string
 *                          example: "info"
 *     responses:
 *       200:
 *         description: Returns the categories filtered list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: number
 *       500:
 *         description: Internal server error
 */
router.post('/', authAdmin, categoryControl, addCategory);

/**
 * @swagger
 * /categories/{idEdit}:
 *   put:
 *     tags: ['Categories operations']
 *     description: Create new Category
 *     summary: Must be connected as admin
 *     responses:
 *       200:
 *         description: Edit and return the category with spesfic `id`
 *         content:
 *           application/json:
 *               schema:
 *                 $ref: "#/components/schemas/category"
 *       500:
 *         description: Internal server error
 */
router.put('/:idEdit', authAdmin, categoryControl, editCategory);

/**
 * @swagger
 * /categories/{idDel}:
 *   delete:
 *     tags: ['Categories operations']
 *     description: Create new Category
 *     summary: Must be connected as admin
 *     responses:
 *       200:
 *         description: Edit and return the category with spesfic `id`
 *         content:
 *           application/json:
 *               schema:
 *                 $ref: "#/components/schemas/category"
 *       500:
 *         description: Internal server error
 */
router.delete('/:idDel', authAdmin, deleteCategory);

export default router;
