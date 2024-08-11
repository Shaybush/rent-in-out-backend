export interface IUserVerification extends Document {
	userId: string;
	uniqueString: string;
	createdAt: number;
	expiresAt: number;
}
