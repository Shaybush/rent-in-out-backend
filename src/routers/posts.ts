import express from 'express';
import { postCtrl } from '../controllers/postCtrl';
import { auth, authAdmin } from '../middlewares/auth';
const router = express.Router();
// CRUD

// router.get('/', postCtrl.getAll);
// router.post('/', auth, postCtrl.upload);
// router.put('/:postID', auth, postCtrl.update);
// router.delete('/:postID', auth, postCtrl.delete);

// CRUD done

// router.get('/getPostByID/:postID', postCtrl.postByID);
// router.get('/count', postCtrl.countAll);
// router.get('/search', postCtrl.search);
// router.get('/checkLikes/:postID', postCtrl.countLikes);
// router.get('/topThreeLikes/:postID', postCtrl.topThreeLikes);
// router.get('/countMyPosts', auth, postCtrl.countMyPosts);
// router.get('/userPosts/:userID', postCtrl.userPosts);
// router.get('/count-by-category', postCtrl.countByCategory);

// router.post('/likePost/:postID', auth, postCtrl.likePost);
// router.post('/singleImgDel/:postID/:imgID', auth, postCtrl.singlePostImgDelete);
// router.post('/onCancelImgDel', auth, postCtrl.onCancelDel);

// router.patch('/changeRange/:postID', auth, postCtrl.changeRange);
// router.patch('/changeActive/:postID', authAdmin, postCtrl.changeActive);

export default router;
