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

/**
 * @swagger
 * /users/login:
 *   post:
 *     tags: ['Auth operations']
 *     description: Login to the app
 *     requestBody:
 *        description: User's data
 *        required: true
 *        content:
 *           application/json:
 *               schema:
 *                  type: object
 *                  required: [ "email", "password" ]
 *                  properties:
 *                      email:
 *                          type: string
 *                          example: "johnsnow@gmail.com"
 *                      password:
 *                          type: string
 *                          example: ""
 *     responses:
 *       200:
 *         description: Logged in successfully
 *         content:
 *             application/json:
 *                   schema:
 *                     type: object
 *                     properties:
 *                      token:
 *                         type: string
 *                         example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                      user:
 *                        $ref: "#/components/schemas/user"
 *       400:
 *         description: Login failed
 *       500:
 *         description: Internal server error
 */
router.post('/login', loginGmail, userLoginControl, login);
/**
 * @swagger
 * /users/requestPasswordReset:
 *   post:
 *     tags: ['Auth operations']
 *     description: Login to the app
 *     requestBody:
 *        description: User's data
 *        required: true
 *        content:
 *           application/json:
 *               schema:
 *                  type: object
 *                  required: [ "email", "redirectUrl" ]
 *                  properties:
 *                      email:
 *                          type: string
 *                          example: "shaybush93@gmail.com"
 *                      password:
 *                          type: string
 *     responses:
 *       403:
 *         description: Email isn't verified yet or account has been suspended, please check your email
 *       404:
 *         description: No account with the supplied email found. Please try again.
 */
router.post('/requestPasswordReset', requestPasswordReset);
/**
 * @swagger
 * /users/resetPassword:
 *   post:
 *     tags: ['Auth operations']
 *     description: Login to the app
 *     requestBody:
 *        description: User's data
 *        required: true
 *        content:
 *           application/json:
 *               schema:
 *                  type: object
 *                  required: [ "userId", "resetString", "newPassword" ]
 *                  properties:
 *                      userId:
 *                          type: string
 *                      resetString:
 *                          type: string
 *                      newPassword:
 *                          type: string
 *     responses:
 *       200:
 *         description: Reset password has been changed succefully.
 *         content:
 *             application/json:
 *                   schema:
 *                     type: object
 *                     properties:
 *                      status:
 *                         type: string
 *                      msg:
 *                        type: string
 *       403:
 *         description: Email isn't verified yet or account has been suspended, please check your email
 *       404:
 *         description: No account with the supplied email found. Please try again.
 */
router.post('/resetPassword', resetPassword);
/**
 * @swagger
 * /users/resetPassword:
 *   post:
 *     tags: ['Auth operations']
 *     description: Login to the app
 *     requestBody:
 *        description: User's data
 *        required: true
 *        content:
 *           application/json:
 *               schema:
 *                  type: object
 *                  required: [ "phone", "firstName", "lastName", "email", "textarea" ]
 *                  properties:
 *                      phone:
 *                          type: string
 *                      firstName:
 *                          type: string
 *                      lastName:
 *                          type: string
 *                      email:
 *                          type: string
 *                      textarea:
 *                          type: string
 *     responses:
 *       200:
 *         description: Reset password has been changed succefully.
 *         content:
 *             application/json:
 *                   schema:
 *                     type: object
 *                     properties:
 *                      status:
 *                         type: string
 *                      msg:
 *                        type: string
 *       403:
 *         description: Email isn't verified yet or account has been suspended, please check your email
 *       404:
 *         description: No account with the supplied email found. Please try again.
 */
router.post('/clientEmail', sendEmail);

/**
 * @swagger
 * /users/login/gmail:
 *   post:
 *     tags: ['Auth operations']
 *     description: Login with gmail token
 *     requestBody:
 *        description: User's data
 *        required: true
 *        content:
 *           application/json:
 *               schema:
 *                  type: object
 *                  required: "token"
 *                  properties:
 *                      token:
 *                          type: string
 *                          example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
 *     responses:
 *       200:
 *         description: Logged in successfully
 *         content:
 *             application/json:
 *                   schema:
 *                     type: object
 *                     properties:
 *                      token:
 *                         type: string
 *                         example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                      user:
 *                        $ref: "#/components/schemas/user"
 *       401:
 *         description: User blocked / need to verify your email
 *       404:
 *         description: User not found
 *       500:
 *         description: Couldn't login google
 */
router.post('/login/gmail', loginGmail);

export default router;
