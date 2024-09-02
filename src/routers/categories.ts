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
 *     tags:
 *     -  Categories operations
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
 *         description: Returns the categories list.
 *         content:
 *           application/json:
 *               schema:
 *                  type: array
 *                  items:
 *                    $ref: "#/components/schemas/category"
 *       500:
 *         description: Internal server error
 */
router.get('/', getCategorylist);

/**
 * @swagger
 * /categories/search:
 *   get:
 *     tags:
 *     -  Categories operations
 *     description: Get filtered categories list.
 *     summary: Must be connected as admin
 *     security:
 *       - apiKeyAuth: []
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
 *         description: Returns the filtered categories list.
 *         content:
 *           application/json:
 *             schema:
 *                type: array
 *                items:
 *                  $ref: "#/components/schemas/category"
 *       500:
 *         description: Internal server error
 */
router.get('/search', authAdmin, searchCategories);

/**
 * @swagger
 * /categories/count:
 *   get:
 *     tags:
 *     -  Categories operations
 *     description: Get the categories amount.
 *     responses:
 *       200:
 *         description: Returns the categories amount.
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
 *     tags:
 *     -  Categories operations
 *     description: Create new Category.
 *     summary: Must be connected as admin
 *     requestBody:
 *        description: Categories data body
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
 *         description: Returns new category has been added.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/category"
 *       400:
 *         description: Unauthenticated user
 *       500:
 *         description: Internal server error
 */
router.post('/', authAdmin, categoryControl, addCategory);

/**
 * @swagger
 * /categories/{idEdit}:
 *   put:
 *     tags:
 *     -  Categories operations
 *     description: Edit category by spesific id.
 *     summary: Must be connected as admin
 *     responses:
 *       200:
 *         description: Edit and return the category with spesfic `id`.
 *         content:
 *           application/json:
 *               schema:
 *                 $ref: "#/components/schemas/category"
 *       400:
 *         description: Unauthenticated user
 *       500:
 *         description: Internal server error
 */
router.put('/:idEdit', authAdmin, categoryControl, editCategory);

/**
 * @swagger
 * /categories/{idDel}:
 *   delete:
 *     tags:
 *     -  Categories operations
 *     description: Delete Category by id.
 *     summary: Must be connected as admin
 *     responses:
 *       200:
 *         description: Delete and return the category with spesfic `id`.
 *         content:
 *           application/json:
 *               schema:
 *                 $ref: "#/components/schemas/category"
 *       500:
 *         description: Internal server error
 */
router.delete('/:idDel', authAdmin, deleteCategory);

export default router;
