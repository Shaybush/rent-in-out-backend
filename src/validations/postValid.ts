import Joi from 'joi';

// TODO - interfaces should be in separated file
export interface ICloudinaryModel {
	url: string;
	img_id: string;
}

interface ICollectPoints {
	x: number;
	y: number;
}

interface IReqBodyPostModel {
	title: string;
	info: string;
	range?: 'long-term' | 'short-term';
	price: number;
	type?: 'rent' | 'exchange' | 'delivery';
	available_from?: Date | string | number;
	country: string;
	city: string;
	category_url: string;
	img?: ICloudinaryModel[];
	collect_points?: ICollectPoints[];
}

export const validatePost = (reqBody: IReqBodyPostModel) => {
	let cloudinary = Joi.object().keys({
		url: Joi.string().required(),
		img_id: Joi.string().required(),
	});
	let joiSchema = Joi.object({
		title: Joi.string().min(2).max(50).required(),
		info: Joi.string().min(2).max(1500).required(),
		range: Joi.string().valid('long-term', 'short-term').allow(null, ''),
		price: Joi.number().min(1).max(10000000).required(),
		type: Joi.string().valid('rent', 'exchange', 'delivery').allow(null, ''),
		available_from: Joi.date().allow(null, ''),
		country: Joi.string().min(2).max(50).required(),
		city: Joi.string().min(2).max(50).required(),
		category_url: Joi.string().min(2).max(50).required(),
		img: Joi.array().items(cloudinary),
		collect_points: Joi.array().items(),
	});
	return joiSchema.validate(reqBody);
};
