import { NextFunction, Request, Response } from 'express';
import { select } from '../helpers/userHelper';
import { CategoryModel } from '../models/categoryModel';
import { validateCategory } from '../validations/categoryValid';
import { SortOrder } from 'mongoose';

// Get Category List
export const getCategorylist = async (req: Request, res: Response, _next: NextFunction) => {
	let sort = (req.query.sort as string) || 'name';
	let reverse: SortOrder = req.query.reverse === 'yes' ? -1 : 1;
	try {
		let data = await CategoryModel.find({})
			.sort([[sort, reverse]])
			.populate({ path: 'creator_id', select })
			.populate({ path: 'editor_id', select });
		return res.json(data);
	} catch (err) {
		return res.status(500).json({ msg: 'There was an error, please try again later', err });
	}
};

// Search Categories
export const searchCategories = async (req: Request, res: Response, _next: NextFunction) => {
	const perPage = Math.min(Number(req.query.perPage) || 10, 20);
	const page = Number(req.query.page) || 1;
	const sort = (req.query.sort as string) || 'createdAt';
	const reverse: SortOrder = req.query.reverse === 'yes' ? -1 : 1;
	try {
		const searchQ = req.query.s as string;
		const searchReg = new RegExp(searchQ, 'i');
		const categories = await CategoryModel.find({
			$and: [
				{
					$or: [{ name: searchReg }, { info: searchReg }, { url_name: searchReg }],
				},
			],
		})
			.limit(perPage)
			.skip((page - 1) * perPage)
			.sort([[sort, reverse]])
			.populate({ path: 'creator_id', select })
			.populate({ path: 'editor_id', select });

		return res.json(categories);
	} catch (error) {
		return res.status(500).json({ msg: 'There was an error, please try again later', err: error });
	}
};

// Add Category
// TODO - figure out how to handle type issue with req: Request ->  not recognize this req.tokenData._id
export const addCategory = async (req, res: Response, _next) => {
	const validBody = validateCategory(req.body);
	if (validBody.error) {
		return res.status(400).json(validBody.error.details);
	}
	try {
		const newCategory = new CategoryModel(req.body);
		newCategory.creator_id = String(req.tokenData._id);
		newCategory.editor_id = String(req.tokenData._id);
		await newCategory.save();
		const category = await CategoryModel.findById(newCategory._id)
			.populate({ path: 'creator_id', select })
			.populate({ path: 'editor_id', select });

		return res.json(category);
	} catch (error: any) {
		if (error.code === 11000) {
			return res.status(409).json({
				msg: 'Category already in system, try a different name',
				code: 11000,
			});
		}

		return res.status(500).json({ msg: 'There was an error, please try again later', err: error });
	}
};

// Edit Category
// TODO - figure out how to handle type issue with req: Request ->  not recognize this req.tokenData._id
export const editCategory = async (req, res: Response, _next: NextFunction) => {
	const validBody = validateCategory(req.body);
	if (validBody.error) {
		return res.status(400).json(validBody.error.details);
	}
	try {
		const idEdit = req.params.idEdit;
		await CategoryModel.updateOne({ _id: idEdit }, req.body);
		const category = await CategoryModel.findOne({ _id: idEdit });
		if (category) {
			category.updatedAt = new Date(Date.now());
			category.editor_id = String(req.tokenData._id);
			await category.save();
			return res.status(200).json({ category });
		}
		return res.status(400).json({ msg: 'Category not found' });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ msg: 'There was an error, please try again later', err: error });
	}
};

// Delete Category
export const deleteCategory = async (req: Request, res: Response, _next: NextFunction) => {
	try {
		const idDel = req.params.idDel;
		const data = await CategoryModel.deleteOne({ _id: idDel });
		return res.json(data);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ msg: 'There was an error, please try again later', err: error });
	}
};

// Count Categories
export const countCategories = async (req: Request, res: Response, _next: NextFunction) => {
	try {
		const count = await CategoryModel.countDocuments({});
		return res.json({ count });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ msg: 'There was an error, please try again later', err: error });
	}
};
