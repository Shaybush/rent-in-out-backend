export {};

declare global {
	namespace Express {
		interface Request {
			tokenData: {
				_id: string;
			};
			query: {
				perPage: number;
				sort: string;
			};
		}
	}
}
