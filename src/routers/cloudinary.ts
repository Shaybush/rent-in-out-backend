import express from 'express';
import { auth } from '../middlewares/auth';
import { deleteImageCloudinary } from '../services/cloudinaryService';

const router = express();
/**
 * @swagger
 * /cloudinary/image:
 *   delete:
 *     tags:
 *       - Cloudinary operations
 *     summary: Delete an image from Cloudinary
 *     description: Deletes an image from Cloudinary using its image ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               img_id:
 *                 type: string
 *                 description: The ID of the image to delete from Cloudinary.
 *             required:
 *               - img_id
 *     responses:
 *       201:
 *         description: Image deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *                   description: The result from Cloudinary after deletion.
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       description: Error message
 *                     name:
 *                       type: string
 *                       description: Error name
 *                     http_code:
 *                       type: number
 *                       description: HTTP status code
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Couldn't find resource with id
 */

router.delete('/image', auth, deleteImageCloudinary);

export default router;
