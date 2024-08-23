import bcrypt from 'bcrypt';
import { UserVerificationModel } from '../models/userVerificationModel';
import { PasswordReset } from '../models/passwordReset';
import { v4 as uuidv4 } from 'uuid';
import { envConfig } from '../config/config-env';
import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { Types } from 'mongoose';
import axios from 'axios';
import { createEmailOptions, transporter } from '../config/mail.config';

const saltRounds = 10;
// populate creator filter

export const sendVerificationEmail = async ({ _id, email }, res: Response) => {
	const uniqueString = uuidv4() + _id;
	const html = `<p>Verify Your Email </p><p> click <a href=${envConfig.domain + '/users/verify/' + _id + '/' + uniqueString}> here</a></p>`;

	// creat an unique string
	// create email options for spcific collection
	let mail = createEmailOptions('Verify Your Email', html, email);
	await bcrypt
		.hash(uniqueString, saltRounds)
		// hashed the unique string
		.then((hasheduniqueString) => {
			// create ne collection in verify user model
			const userVerification = new UserVerificationModel({
				userId: _id,
				uniqueString: hasheduniqueString,
			});
			userVerification
				.save()
				.then(() => {
					// send the email notification
					transporter.sendMail(mail, (err, info) => {
						if (err) {
							console.error(err);
						}
					});
				})
				.catch((error) => {
					console.error(error);
					res.json({
						status: 'failed',
						message: 'an error  cant save',
					});
				});
		});
};

// redirect url is an frontend url were we reset password
export const sendResetEmail = async ({ _id, email }, redirectUrl: string, res: Response) => {
	// if request already in system
	let request = await PasswordReset.findOne({ _id });
	if (request) {
		await PasswordReset.deleteOne({ _id });
	}

	const resetString = uuidv4() + _id;
	const html = `<p>We heard that you forgot your password.</p>
    <p>Don't worry, use the link below to reset it.</p>
    <p>This link <b>expires in 60min </b></p>
    <p>Press <a href=${redirectUrl + '/' + _id + '/' + resetString}>here</a></p>`;
	// clear all existing request for the same user
	let mail = createEmailOptions('Password reset', html, email);
	PasswordReset.deleteMany({ userId: _id })
		.then((result) => {
			bcrypt
				.hash(resetString, saltRounds)
				// create new password request
				.then((hashedResetString) => {
					const newPasswordReset = new PasswordReset({
						userId: _id,
						resetString: hashedResetString,
					});
					newPasswordReset.save().then(() => {
						// send the email notification
						transporter.sendMail(mail, (err, info) => {
							return res.json({
								status: 'Pending',
								message: 'Password reset email sent',
							});
						});
					});
				});
		})
		.catch((error) => {
			console.error(error);
			res.json({
				status: 'failed',
				message: 'Error while cleaning existing requests',
			});
		});
};

export const createToken = (id: Types.ObjectId | string, role: string) => {
	let token = jwt.sign({ _id: id, role }, envConfig.tokenSecret, { expiresIn: '15h' });
	return token;
};

export const getUserDetailFromAccessToken = (access_token: string) => {
	const googleDomain = envConfig.google_api;

	return axios.get(`${googleDomain}/oauth2/v1/userinfo?access_token=${access_token}`, {
		headers: {
			Authorization: `Bearer ${access_token}`,
			Accept: 'application/json',
		},
	});
};
