import { NextFunction, Request, Response } from 'express';
import { validatePost } from '../validations/postValid';

export const postControl = (req: Request, res: Response, next: NextFunction): void => {
	const { error } = validatePost(req.body);
	if (error) {
		res.status(400).json(error.details);
		throw new Error(String(error.details));
	} else {
		next();
	}
};

export const postRangeControl = (req: Request, res: Response, next: NextFunction): void => {
	if (!req.body.range) {
		res.status(400).json({ msg: 'Need to send range in body' });
	} else if (req.body.range !== 'long-term' && req.body.range !== 'short-term') {
		res.status(400).json({ msg: 'Range must be long/short-term' });
	} else {
		next();
	}
};
