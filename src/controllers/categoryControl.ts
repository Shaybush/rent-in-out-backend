import { NextFunction, Request, Response } from 'express';
import { validateCategory } from '../validations/categoryValid';

export const categoryControl = (req: Request, res: Response, next: NextFunction): void => {
	const { error } = validateCategory(req.body);
	if (error) {
		res.status(400).json(error.details);
		throw new Error(String(error.details));
	} else {
		next();
	}
};
