import mongoose, { Schema } from 'mongoose';
import { IUserVerification } from './interfaces/userVerification.interface';

const userVerificationSchema: Schema = new Schema({
	userId: { type: String, required: true },
	uniqueString: { type: String, required: true },
	createdAt: { type: Date, default: new Date(Date.now() + 2 * 60 * 60 * 1000) },
	expiresAt: { type: Date, default: new Date(Date.now() + 8 * 60 * 60 * 1000) },
});

export const UserVerificationModel = mongoose.model<IUserVerification>('verifyusers', userVerificationSchema);
