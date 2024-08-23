import { NextFunction, Request, Response } from 'express';
import { createEmailOptions, transporter } from '../config/mail.config';

export const sendEmail = (req: Request, res: Response, _next: NextFunction) => {
	let subject = 'mail send from ' + req.body.phone;
	let htmlMessage = `<div color:danger> <h2>${req.body.firstName} - ${req.body.lastName}</h2> <span>${req.body.phone}</span> | <span>${req.body.email}</span> <p>${req.body.textarea}</p> </div>`;
	const email = createEmailOptions(subject, htmlMessage);
	try {
		transporter.sendMail(email, () => {
			res.json({
				status: 201,
				message: 'The message sent successfully',
			});
			return;
		});
	} catch (err) {
		return res.json({ err: 'There was an issue.' });
	}
};
