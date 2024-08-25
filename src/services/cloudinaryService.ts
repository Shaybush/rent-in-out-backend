import { NextFunction, Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { cloudinaryConfig } from '../utils/cloudinary-utils';

export interface ICloudinaryResultModel {
	result: string;
}
export interface ICloudinaryErrorModel {
	message: string;
	name: string;
	http_code: number;
}

export const deleteImageCloudinary = (req: Request, res: Response, _next: NextFunction) => {
	const { img_id } = req.body;
	try {
		cloudinary.config(cloudinaryConfig);
		cloudinary.uploader.destroy(img_id, (error: ICloudinaryErrorModel, result: ICloudinaryResultModel) => {
			if (error) return res.json({ error });
			res.send(result);
		});
	} catch (error) {
		res.json({ error: `Couldn't find resource with id - ${img_id}` });
	}
};
