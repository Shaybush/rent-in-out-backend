import nodemailer from 'nodemailer';
import { envConfig } from './config-env';

export const transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 465,
	secure: true, // use SSL
	auth: {
		user: envConfig.gmailUser,
		pass: envConfig.gmailPass,
	},
});

export const createEmailOptions = (subject: string, html: string, email?: string) => {
	return {
		from: envConfig.gmailUser,
		to: email ?? envConfig.gmailUser,
		subject,
		html,
	};
};
