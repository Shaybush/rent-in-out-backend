import { config } from '../config/config';

export const cloudinaryBannerConfig = {
	cloud_name: config.cloudinary_banner_name,
	api_key: config.cloudinary_banner_key,
	api_secret: config.cloudinary_banner_secret,
	type: 'upload',
};

export const cloudinaryProfileConfig = {
	cloud_name: config.cloudinary_profile_name,
	api_key: config.cloudinary_profile_key,
	api_secret: config.cloudinary_profile_secret,
	type: 'upload',
};
