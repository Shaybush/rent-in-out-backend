import mongoose from 'mongoose';

let userVerificationSchema = new mongoose.Schema({
  userId: String,
  uniqueString: String,
  createdAt: { type: Date, default: new Date(Date.now() + 2 * 60 * 60 * 1000),},
  expiresAt: { type: Date, default: new Date(Date.now() + 8 * 60 * 60 * 1000)},
});

export const UserVerificationModel = mongoose.model('verifyusers', userVerificationSchema);