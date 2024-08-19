import mongoose from 'mongoose';

export interface Cloudinary {
	url: string;
	img_id: string;
}

interface Rank {
	user_id: string;
	rank: number;
}

export interface IUser extends Document {
	fullName: {
		firstName: string;
		lastName: string;
	};
	email: string;
	password: string;
	password_changed: Date;
	phone: string;
	profile_img: Cloudinary;
	cover_img: Cloudinary;
	country: string;
	city: string;
	birthdate: Date;
	role: string;
	active: boolean;
	rank: Rank[];
	productsList: string[];
	wishList: mongoose.Types.ObjectId[]; // TODO - improve that
	messages: mongoose.Types.ObjectId[];
	createdAt: number | Date;
	updatedAt: number | Date;
}
