import express from 'express';
import { auth, authAdmin } from '../middlewares/auth';
import {
	countUsers,
	getUserInfoByIdWithToken,
	getUserInfoById,
	getUsersList,
	searchUsers,
	getUserAvgRank,
	getWishListOfUser,
	getUsersCountByDate,
	editUser,
	changeUserRole,
	changeUserActiveStatus,
	rankUser,
	uploadProfileImg,
	uploadBannerImg,
	deleteUser,
	deleteProfileImg,
	deleteBannerImg,
} from '../controllers/userCtrl';
import { login, requestPasswordReset, resetPassword, signUp, verifiedUser, verifyUser } from '../controllers/authCtrl';
import { chatUpdate, deleteChat, deleteMessage, getChatByRoomID, getUserChats } from '../controllers/socketCtrl';
import { loginGmail } from '../middlewares/loginGmail.middleware';
import { sendEmail } from '../controllers/sendEmail';

const router = express.Router();

router.get('/verified', verifiedUser);
router.get('/verify/:userId/:uniqueString', verifyUser);
router.get('/userList', authAdmin, getUsersList);
router.get('/userSearch', searchUsers);
router.get('/count', authAdmin, countUsers);
router.get('/info/:id', getUserInfoById);
router.get('/infoToken/:id', auth, getUserInfoByIdWithToken);
router.get('/getRank/:userID', getUserAvgRank);
router.get('/getChat/:roomID', auth, getChatByRoomID);
router.get('/getAllChat', auth, getUserChats);
router.get('/getWishList', auth, getWishListOfUser);
router.get('/users-by-date', auth, getUsersCountByDate);

router.put('/:idEdit', auth, editUser);
router.patch('/changeRole/:userID', authAdmin, changeUserRole);
router.patch('/changeActive/:userID', authAdmin, changeUserActiveStatus);
router.patch('/rankUser/:userID', auth, rankUser);
router.patch('/uploadProfile', auth, uploadProfileImg);
router.patch('/uploadBanner', auth, uploadBannerImg);
router.patch('/chatUpdate', auth, chatUpdate);

router.delete('/:idDel', auth, deleteUser);
router.delete('/deleteChat/:chatID', auth, deleteChat);
router.delete('/deleteMessage/:roomID/:msgID', auth, deleteMessage);

router.post('/cloudinary/profileDel', deleteProfileImg);
router.post('/cloudinary/bannerDel', auth, deleteBannerImg);
router.post('/', signUp);
router.post('/login', loginGmail, login);
router.post('/requestPasswordReset', requestPasswordReset);
router.post('/resetPassword', resetPassword);
router.post('/clientEmail', sendEmail);
// // google signIn
router.post('/login/gmail', loginGmail);

export default router;
