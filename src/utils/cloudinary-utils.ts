import { envConfig } from '../config/config-env';

export const cloudinaryBannerConfig = {
	cloud_name: envConfig.cloudinary_banner_name,
	api_key: envConfig.cloudinary_banner_key,
	api_secret: envConfig.cloudinary_banner_secret,
	type: 'upload',
};

export const cloudinaryProfileConfig = {
	cloud_name: envConfig.cloudinary_profile_name,
	api_key: envConfig.cloudinary_profile_key,
	api_secret: envConfig.cloudinary_profile_secret,
	type: 'upload',
};
