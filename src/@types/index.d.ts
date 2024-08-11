import { IUser } from '../models/interfaces/userInterface.interface';

export {};

declare global {
	namespace Express {
		interface Request {
			_id: Types.ObjectId;
			user: IUser;

			tokenData: {
				_id: Types.ObjectId;
				role: string;
			};
		}
	}
}
