export {};

declare global {
	namespace Express {
		interface Request {
			_id: Types.ObjectId;

			tokenData: {
				_id: Types.ObjectId;
				role: string;
			};
		}
	}
}
