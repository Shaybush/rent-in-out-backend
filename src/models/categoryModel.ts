import mongoose from 'mongoose';
import { Schema, Types } from 'mongoose';
import { ICategoryModel } from '../interfaces/category.interface';

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
