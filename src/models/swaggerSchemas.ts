import m2s from 'mongoose-to-swagger';

import { CategoryModel } from './categoryModel';
import { PostModel } from './postModel';
import { UserModel } from './userModel';

const definitions = {
	category: m2s(CategoryModel),
	post: m2s(PostModel),
	user: m2s(UserModel),
	pagination: {
		type: 'object',
		properties: {
			page: { type: 'number', required: true },
			totalItems: { type: 'number', required: true },
			itemsPerPage: { type: 'number' },
			totalPages: { type: 'number' },
		},
	},
};

export default definitions;
