import { envConfig } from '../config/config-env';

export const cloudinaryConfig = {
	cloud_name: envConfig.cloudinary_name,
	api_key: envConfig.cloudinary_key,
	api_secret: envConfig.cloudinary_secret,
};
