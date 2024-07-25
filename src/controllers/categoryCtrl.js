const { select } = require('../helpers/userHelper');
const { CategoryModel } = require('../models/categoryModel');
const { validateCategory } = require('../validations/categoryValid');
const MAX = 10000000;
const MIN = 0;

exports.categoryCtrl = {
  getCategorylist: async(req, res) => {
    let sort = req.query.sort || 'name';
    let reverse = req.query.reverse == 'yes' ? -1 : 1;
    try {
      let data = await CategoryModel.find({})
        .sort({ [sort]: reverse })
        .populate({ path: 'creator_id', select })
        .populate({ path: 'editor_id', select });
      return res.json(data);
    } catch (err) {
      return res.status(500).json({ msg: 'there error try again later', err });
    }
  },
  search: async(req, res) => {
    let perPage = Math.min(req.query.perPage, 20) || 10;
    let page = req.query.page || 1;
    let sort = req.query.sort || 'createdAt';
    let reverse = req.query.reverse == 'yes' ? -1 : 1;
    try {
      let searchQ = req.query?.s;
      let searchReg = new RegExp(searchQ, 'i');
      let category = await CategoryModel.find({
        $and: [
          {
            $or: [
              { name: searchReg },
              { info: searchReg, url_name: searchReg },
            ],
          },
        ],
      })
        .limit(perPage)
        .skip((page - 1) * perPage)
        .sort({ [sort]: reverse })
        .populate({ path: 'creator_id', select })
        .populate({ path: 'editor_id', select });
      return res.json(category);
    } catch (err) {
      res.status(500).json({ message: err });
    }
  },

  addCategory: async(req, res) => {
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
    } catch (err) {
      if (err.code == 11000) {
        return res.status(409).json({
          msg: 'Category already in system, try different',
          code: 11000,
        });
      }
      return res.status(500).json({ msg: 'err', err });
    }
  },

  editCategory: async(req, res) => {
    let validBody = validateCategory(req.body);
    if (validBody.error) {
      res.status(400).json(validBody.error.details);
    }
    try {
      let idEdit = req.params.idEdit;
      await CategoryModel.updateOne({ _id: idEdit }, req.body);
      let category = await CategoryModel.findOne({ _id: idEdit });
      category.updatedAt = new Date(Date.now() + 2 * 60 * 60 * 1000);
      category.editor_id = req.tokenData._id;
      category.save();
      res.json({ category });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'err', err });
    }
  },

  deleteCategory: async(req, res) => {
    try {
      let idDel = req.params.idDel;
      let data = await CategoryModel.deleteOne({ _id: idDel });
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'err', err });
    }
  },
  count: async(req, res) => {
    try {
      let count = await CategoryModel.countDocuments({});
      res.json({ count });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'err', err });
    }
  }
};
