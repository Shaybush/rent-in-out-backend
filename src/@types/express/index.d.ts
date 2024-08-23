import { Types } from 'mongoose';
import { IUser } from '../../models/interfaces/userInterface.interface';
export {};

declare global {
	namespace Express {
		interface Request {
			_id: Types.ObjectId;
			user: IUser;

			tokenData: {
				_id: string | Types.ObjectId;
				role: string;
			};
		}
	}
}
