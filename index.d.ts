import { Types } from 'mongoose';
export {};

declare global {
	namespace Express {
		interface Request {
			_id: Types.ObjectId;
			user: string;

			tokenData: {
				_id: string | Types.ObjectId;
				role: string;
			};
		}
	}
}
