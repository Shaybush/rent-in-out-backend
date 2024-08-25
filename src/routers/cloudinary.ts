import express from 'express';
import { auth } from '../middlewares/auth';
import { deleteImageCloudinary } from '../services/cloudinaryService';

const router = express();

router.delete('/image', auth, deleteImageCloudinary);

export default router;
