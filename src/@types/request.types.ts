// import { Request as ExpressRequest } from 'express';
// import { Types } from 'mongoose';

// // --------------------- params ---------------------
// type RequestParamsCategory = {
// 	idEdit: string;
// 	idDel: string;
// };

// type RequestParamsAuth = {
// 	userId: string;
// 	uniqueString: string;
// };

// type RequestParamsPost = {
// 	postID: string;
// 	userID: string;
// 	imgID: string;
// };

// type RequestParamsSocket = {
// 	roomID: string;
// 	msgID: number;
// 	chatID: Types.ObjectId;
// };

// type RequestParamsUser = {
// 	id: string;
// };

// // --------------------- request body ---------------------
// type RequestBodyAuth = {
// 	userId: string;
// 	resetString: string;
// 	newPassword: string;
// 	redirectUrl: string;
// 	fullName: {
// 		firstName: string;
// 		lastName: string;
// 	};
// 	email: string;
// 	password: string;
// 	profile_img?: ICloudinaryModel;
// 	cover_img?: ICloudinaryModel;
// 	city: string;
// 	country: string;
// 	birthdate: Date | string | number;
// 	phone: string;
// };

// type RequestBodyCategory = {
// 	name: string;
// 	url_name: string;
// 	info: string;
// };

// type RequestBodyPost = {
// 	title: string;
// 	info: string;
// 	range?: 'long-term' | 'short-term';
// 	price: number;
// 	type?: 'rent' | 'exchange' | 'delivery';
// 	available_from?: Date | string | number;
// 	country: string;
// 	city: string;
// 	category_url: string;
// 	img?: ICloudinaryModel[];
// 	collect_points?: ICollectPoints[];
// };

// type RequestBodyEmail = {
// 	firstName: string;
// 	lastName: string;
// 	textarea: string;
// };

// type RequestBodySocket = {
// 	userID: string;
// 	creatorID: string;

// 	messageObj: {
// 		roomID: Types.ObjectId;
// 		messagesArr: ISocketMessageModel[];
// 	};
// };

// type RequestBodyUser = {
// 	rnk: number;
// };

// interface ISocketMessageModel {
// 	sender: string;
// 	userName: string;
// 	message: string;
// }

// interface ICloudinaryModel {
// 	url: string;
// 	img_id: string;
// }

// interface ICollectPoints {
// 	x: number;
// 	y: number;
// }

// // --------------------- query ---------------------
// type RequestQueryCategory = {
// 	perPage: number;
// 	page: number;
// 	sort: string;
// 	reverse: string;
// 	s: string;
// };

// type RequestQueryPost = {
// 	searchQ: string;
// 	max: number;
// 	min: number;
// 	categories: string;
// };

// type RequestQueryUser = {
// 	rankingUser: string;
// 	id: string;
// };
// // --------------------- response body ---------------------

// export type RequestParams = RequestParamsCategory &
// 	RequestParamsAuth &
// 	RequestParamsPost &
// 	RequestParamsSocket &
// 	RequestParamsUser;
// export type RequestBody = RequestBodyAuth &
// 	RequestBodyCategory &
// 	RequestBodyPost &
// 	RequestBodyEmail &
// 	RequestBodySocket &
// 	RequestBodyUser;
// export type RequestQuery = RequestQueryCategory & RequestQueryPost & RequestQueryUser;

// export type ResponseBody = {};

// export interface CustomRequest extends ExpressRequest<RequestParams, ResponseBody, RequestBody, RequestQuery> {
// 	tokenData: {
// 		_id: Types.ObjectId | string;
// 		role: string;
// 	};
// }

// TODO - uncomment if need to
