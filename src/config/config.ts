import dotenv from 'dotenv';
dotenv.config();

export const config = {
  userDb: process.env.USER_DB,
  passDb: process.env.PASS_DB,
  tokenSecret: process.env.TOKEN_SECRET,
  refreshToken: process.env.REFRESH_TOKEN_SECRET,
  superID: process.env.ADMIN_ID,
  google_api: process.env.GOOGLE_API,
  domain: process.env.DOMAIN,
  domain_client: process.env.DOMAIN_CLIENT,
  gmailUser: process.env.AUTH_EMAIL,
  gmailPass: process.env.AUTH_PASS,
  google_client_id: process.env.GOOGLE_CLIENT_ID,
  google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
  cloudinary_profile_name: process.env.CLODINARY_PROFILE_NAME,
  cloudinary_profile_key: process.env.CLODINARY_PROFILE_KEY,
  cloudinary_profile_secret: process.env.CLODINARY_PROFILE_SECRET,
  cloudinary_banner_name: process.env.CLODINARY_BANNER_NAME,
  cloudinary_banner_key: process.env.CLODINARY_BANNER_KEY,
  cloudinary_banner_secret: process.env.CLODINARY_BANNER_SECRET,
  cloudinary_post_name: process.env.CLODINARY_POST_NAME,
  cloudinary_post_key: process.env.CLODINARY_POST_KEY,
  cloudinary_post_secret: process.env.CLODINARY_POST_SECRET,
};
