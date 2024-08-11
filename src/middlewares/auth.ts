import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { NextFunction, Request, Response } from 'express';
import { CustomRequest } from '../@types/request.types';

export const auth = (req: CustomRequest, res: Response, next: NextFunction) => {
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

// TODO - I declare here req as any becuase there is an error make a placement of variable in req, example: req.tokenData = decodeToken; (Error) !
// Improve it later
export const authAdmin = (req: any, res: Response, next: NextFunction) => {
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
