export interface IPasswordReset extends Document {
	userId: string;
	resetString: string;
	createdAt: number;
	expiresAt: number;
}
