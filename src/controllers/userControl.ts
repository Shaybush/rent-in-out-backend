import { NextFunction, Request, Response } from 'express';
import { validateUser, validateUserLogin } from '../validations/userValid';
import { envConfig } from '../config/config-env';

export const userControl = (req: Request, res: Response, next: NextFunction): void => {
	const { error } = validateUser(req.body);
	if (error) {
		res.status(400).json(error.details);
		throw new Error(String(error.details));
	} else {
		next();
	}
};

export const userLoginControl = (req: Request, res: Response, next: NextFunction): void => {
	const { error } = validateUserLogin(req.body);
	if (error) {
		res.status(400).json(error.details);
		throw new Error(String(error.details));
	} else {
		next();
	}
};

export const userSuperAdminControl = (req: Request, res: Response, next: NextFunction): void => {
	const userID = req.params.userID;
	if (userID === envConfig.superID) {
		res.status(401).json({ msg: 'You cannot change Superadmin to user' });
	} else {
		next();
	}
};
