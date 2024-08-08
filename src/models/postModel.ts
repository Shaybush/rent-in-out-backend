import mongoose, { Document, Schema, Types } from 'mongoose';

interface ICloudinary {
	url: string;
	img_id: string;
}

interface ICollectPoints {
	x: number;
	y: number;
}

export interface IPost extends Document {
	_id: Types.ObjectId;
	title: string;
	info: string;
	img: ICloudinary[];
	range: 'long-term' | 'short-term';
	creator_id: Types.ObjectId | string;
	category_url: string;
	price: number;
	type: 'rent' | 'exchange' | 'delivery';
	collect_points: ICollectPoints[]; // Adjust the type based on your requirements
	active: boolean;
	available_from: Date;
	country: string;
	city: string;
	likes: Types.ObjectId[];
	createdAt: number | Date;
	updatedAt: number | Date;
}

const cloudinarySchema = new Schema<ICloudinary>({
	url: { type: String, required: false },
	img_id: { type: String, required: false },
});

const collectPointsSchema = new Schema<ICollectPoints>({
	x: { type: Number, required: false },
	y: { type: Number, required: false },
});

const postSchema = new Schema<IPost>({
	title: String,
	info: String,
	img: {
		type: [cloudinarySchema],
		default: [],
	},
	range: {
		type: String,
		enum: ['long-term', 'short-term'],
		default: 'short-term',
	},
	creator_id: {
		type: Schema.Types.ObjectId,
		ref: 'users',
	},
	category_url: {
		type: String,
		default: 'skate',
	},
	price: Number,
	type: {
		type: String,
		enum: ['rent', 'exchange', 'delivery'],
		default: 'rent',
	},
	collect_points: {
		type: [collectPointsSchema],
		required: true,
	},
	active: {
		type: Boolean,
		default: true,
	},
	available_from: {
		type: Date,
		default: Date.now,
	},
	country: String,
	city: String,
	likes: {
		type: [Types.ObjectId],
		ref: 'users',
	},
	createdAt: {
		type: Number,
		default: Date.now,
	},
	updatedAt: {
		type: Number,
		default: Date.now,
	},
});

export const PostModel = mongoose.model<IPost>('posts', postSchema);
