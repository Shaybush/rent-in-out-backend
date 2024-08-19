import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { NextFunction, Request, Response } from 'express';

// TODO - figure out how to handle type issue with req: Request ->  not recognize this req.tokenData
// I added this type in the declaration file... index.d.ts
export const auth = (req, res: Response, next: NextFunction) => {
	let token = req.header('x-api-key');
	if (!token) {
		return res.status(401).json({ msg: 'please send token this end point url ' });
	}
	try {
		let tokenData = jwt.verify(token, config.tokenSecret);
		req.tokenData = tokenData;
		next();
	} catch (err) {
		return res.status(401).json({ msg: 'token not valid/expired' });
	}
};

// TODO - figure out how to handle type issue with req: Request ->  not recognize this req.tokenData
export const authAdmin = (req, res: Response, next: NextFunction) => {
	let token = req.header('x-api-key');
	if (!token) {
		return res.status(401).json({ msg: 'You need to send token to this endpoint url' });
	}
	try {
		let decodeToken = jwt.verify(token, config.tokenSecret);
		if (decodeToken.role !== 'admin') {
			return res.status(401).json({ msg: 'Token is not admin' });
		}
		req.tokenData = decodeToken;

		next();
	} catch (err) {
		console.error(err);
		return res.status(401).json({ msg: 'Token invalid or expired, log in again or you hacker!' });
	}
};
