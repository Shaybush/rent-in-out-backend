import { Types } from 'mongoose';

export interface ICategoryModel {
	name: string;
	utl_name: string;
	info: string;
	craetedAt: number;
	updatedAt: number | Date;
	creator_id: Types.ObjectId | string;
	editor_id: Types.ObjectId | string;
}
