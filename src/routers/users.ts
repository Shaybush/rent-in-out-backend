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
} from '../services/userService';
import { login, requestPasswordReset, resetPassword, signUp, verifiedUser, verifyUser } from '../services/authService';
import { chatUpdate, deleteChat, deleteMessage, getChatByRoomID, getUserChats } from '../services/socketService';
import { loginGmail } from '../middlewares/loginGmail.middleware';
import { sendEmail } from '../services/emailService';
import { userControl, userLoginControl, userSuperAdminControl } from '../controllers/userControl';

const router = express();

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

router.put('/:idEdit', auth, userControl, editUser);
router.patch('/changeRole/:userID', authAdmin, userSuperAdminControl, changeUserRole);
router.patch('/changeActive/:userID', authAdmin, userSuperAdminControl, changeUserActiveStatus);
router.patch('/rankUser/:userID', auth, rankUser);
router.patch('/chatUpdate', auth, chatUpdate);
router.patch('/uploadProfile', auth, uploadProfileImg);
router.patch('/uploadBanner', auth, uploadBannerImg);

router.delete('/:idDel', auth, deleteUser);
router.delete('/deleteChat/:chatID', auth, deleteChat);
router.delete('/deleteMessage/:roomID/:msgID', auth, deleteMessage);

router.post('/', userControl, signUp);
router.post('/login', loginGmail, userLoginControl, login);
router.post('/requestPasswordReset', requestPasswordReset);
router.post('/resetPassword', resetPassword);
router.post('/clientEmail', sendEmail);
// google signIn
router.post('/login/gmail', loginGmail);

export default router;
