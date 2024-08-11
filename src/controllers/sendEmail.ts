import { NextFunction, Request, Response } from 'express';
import { config } from '../config/config';
import nodemailer from 'nodemailer';
import { CustomRequest } from '../@types/request.types';

const transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 465,
	secure: true,
	auth: {
		user: config.gmailUser,
		pass: config.gmailPass,
	},
});

const mailOptions = (subject: string, html: string) => {
	return {
		from: config.gmailUser,
		to: config.gmailUser,
		subject,
		html,
	};
};

exports.mailMe = {
	sendEmail: (req: CustomRequest, res: Response, _next: NextFunction) => {
		let subject = 'mail send from ' + req.body.phone;
		let htmlMessage = `<div color:danger> <h2>${req.body.firstName} - ${req.body.lastName}</h2> <span>${req.body.phone}</span> | <span>${req.body.email}</span> <p>${req.body.textarea}</p> </div>`;
		const email = mailOptions(subject, htmlMessage);
		try {
			transporter.sendMail(email, () => {
				res.json({
					status: 'send',
					message: 'The message sent successfully',
				});
				return;
			});
		} catch (err) {
			return res.json({ err: 'There was an issue.' });
		}
	},
};
