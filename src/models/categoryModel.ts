import mongoose from 'mongoose';
import { Schema, Types } from 'mongoose';

export interface ICategoryModel {
	name: string;
	utl_name: string;
	info: string;
	craetedAt: number;
	updatedAt: number | Date;
	creator_id: Types.ObjectId | string;
	editor_id: Types.ObjectId | string;
}

const categorySchema = new mongoose.Schema({
	name: String,
	url_name: String,
	info: String,
	craetedAt: {
		type: Date,
		default: new Date(Date.now() + 2 * 60 * 60 * 1000),
	},
	updatedAt: {
		type: Date,
		default: new Date(Date.now() + 2 * 60 * 60 * 1000),
	},
	creator_id: {
		type: Schema.Types.ObjectId,
		ref: 'users',
	},
	editor_id: {
		type: Schema.Types.ObjectId,
		ref: 'users',
	},
});

export const CategoryModel = mongoose.model<ICategoryModel>('categories', categorySchema);
