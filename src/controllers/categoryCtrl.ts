import { NextFunction, Response } from 'express';
import { select } from '../helpers/userHelper';
import { CategoryModel } from '../models/categoryModel';
import { validateCategory } from '../validations/categoryValid';
import { CustomRequest } from '../@types/request.types';
import { SortOrder } from 'mongoose';

exports.categoryCtrl = {
	getCategorylist: async (req: CustomRequest, res: Response, _next: NextFunction) => {
		let sort = req.query.sort || 'name';
		let reverse: SortOrder = req.query.reverse === 'yes' ? -1 : 1;
		try {
			let data = await CategoryModel.find({})
				.sort([[sort, reverse]])
				.populate({ path: 'creator_id', select })
				.populate({ path: 'editor_id', select });
			return res.json(data);
		} catch (err) {
			return res.status(500).json({ msg: 'there error try again later', err });
		}
	},
	search: async (req: CustomRequest, res: Response, _next: NextFunction) => {
		const perPage = Math.min(req.query.perPage || 10, 20);
		const page = req.query.page || 1;
		let sort = req.query.sort || 'createdAt';
		let reverse: SortOrder = req.query.reverse === 'yes' ? -1 : 1;
		try {
			let searchQ = req.query?.s;
			let searchReg = new RegExp(searchQ, 'i');
			let category = await CategoryModel.find({
				$and: [
					{
						$or: [{ name: searchReg }, { info: searchReg, url_name: searchReg }],
					},
				],
			})
				.limit(perPage)
				.skip((page - 1) * perPage)
				.sort([[sort, reverse]])
				.populate({ path: 'creator_id', select })
				.populate({ path: 'editor_id', select });
			return res.json(category);
		} catch (error) {
			res.status(500).json({ message: error });
		}
	},

	addCategory: async (req: CustomRequest, res: Response, _next: NextFunction) => {
		let validBody = validateCategory(req.body);
		if (validBody.error) {
			res.status(400).json(validBody.error.details);
		}
		try {
			let newCategory = new CategoryModel(req.body);
			newCategory.creator_id = req.tokenData._id;
			newCategory.editor_id = req.tokenData._id;
			await newCategory.save();
			let category = await CategoryModel.findById(newCategory._id)
				.populate({ path: 'creator_id', select })
				.populate({ path: 'editor_id', select });
			res.json(category);
		} catch (error: any) {
			if (error.code === 11000) {
				return res.status(409).json({
					msg: 'Category already in system, try different',
					code: 11000,
				});
			}

			return res.status(500).json({ error });
		}
	},

	editCategory: async (req: CustomRequest, res: Response, _next: NextFunction) => {
		let validBody = validateCategory(req.body);
		if (validBody.error) {
			res.status(400).json(validBody.error.details);
		}
		try {
			let idEdit = req.params.idEdit;
			await CategoryModel.updateOne({ _id: idEdit }, req.body);
			let category = await CategoryModel.findOne({ _id: idEdit });
			if (category) {
				category.updatedAt = new Date(Date.now() + 2 * 60 * 60 * 1000);
				category.editor_id = req.tokenData._id;
				category.save();
				res.status(200).json({ category });
			}
			res.status(400).json({ response: 'category not found' });
		} catch (error) {
			console.error(error);
			res.status(500).json({ msg: 'err', err: error });
		}
	},

	deleteCategory: async (req: CustomRequest, res: Response, _next: NextFunction) => {
		try {
			let idDel = req.params.idDel;
			let data = await CategoryModel.deleteOne({ _id: idDel });
			res.json(data);
		} catch (error) {
			console.error(error);
			res.status(500).json({ msg: 'err', err: error });
		}
	},
	count: async (req: CustomRequest, res: Response, _next: NextFunction) => {
		try {
			let count = await CategoryModel.countDocuments({});
			res.json({ count });
		} catch (error) {
			console.error(error);
			res.status(500).json({ msg: 'err', err: error });
		}
	},
};
