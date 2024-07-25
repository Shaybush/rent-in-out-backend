const { config } = require('../config/config');
const { checkUndefinedOrNull } = require('../helpers/functions');
const { select } = require('../helpers/userHelper');
const { PostModel } = require('../models/postModel');
const { UserModel } = require('../models/userModel');
const { validatePost } = require('../validations/postValid');
const cloudinary = require('cloudinary').v2;
const MAX = 10000000;
const MIN = 0;

exports.postCtrl = {
  getAll: async(req, res) => {
    let perPage = Math.min(req.query.perPage, 20) || 15;
    let page = req.query.page || 1;
    let sort = req.query.sort || 'createdAt';
    let reverse = req.query.reverse == 'yes' ? -1 : 1;
    try {
      let posts = await PostModel.find({})
        .sort({ [sort]: reverse })
        .limit(perPage)
        .skip((page - 1) * perPage)
        .populate({ path: 'likes', select })
        .populate({ path: 'creator_id', select });
      return res.json(posts);
    } catch (err) {
      res.status(500).json({ err: err });
    }
  },
  postByID: async(req, res) => {
    let postID = req.params.postID;
    try {
      const post = await PostModel.findById(postID).populate({
        path: 'creator_id',
        select,
      });
      res.status(200).json(post);
    } catch (err) {
      res.status(500).json({ err: 'cannot find the post..' });
    }
  },
  upload: async(req, res) => {
    let validBody = validatePost(req.body);
    if (validBody.error) {
      return res.status(400).json(validBody.error.details);
    }
    try {
      let newPost = new PostModel(req.body);
      newPost.creator_id = req.tokenData._id;
      await newPost.save();
      post = await PostModel.findById(newPost._id).populate({
        path: 'creator_id',
        select,
      });
      res.status(201).json(post);
    } catch (err) {
      res.status(500).json({ err: err });
    }
  },
  update: async(req, res) => {
    try {
      let postID = req.params.postID;
      let data;
      if (req.tokenData.role === 'admin') {
        data = await PostModel.updateOne({ _id: postID }, req.body);
      } else {
        data = await PostModel.updateOne(
          { _id: postID, creator_id: req.tokenData._id },
          req.body
        );
      }
      if (data.modifiedCount === 1) {
        let post = await PostModel.findOne({ _id: postID });
        post.updatedAt = new Date(Date.now() + 2 * 60 * 60 * 1000);
        await post.save();
        return res.status(200).json({ data, msg: 'post edited' });
      }
      res.status(400).json({ data: null, msg: 'cannot edit post' });
    } catch (err) {
      console.error(err);
      res.status(400).json({ err });
    }
  },
  delete: async(req, res) => {
    let postID = req.params.postID;
    // cloudinary details to destroy post
    let details = {
      cloud_name: config.cloudinary_post_name,
      api_key: config.cloudinary_post_key,
      api_secret: config.cloudinary_post_secret,
      type: 'upload',
    };
    // found post by id
    let post = await PostModel.findById(postID);

    // for each image delete from cloudinary to save memory space
    const deleteCloudinaryImages = () => {
      post.img.forEach((img) => {
        cloudinary.uploader.destroy(img.img_id, details, (error, result) => {
          if (error) {return res.json({ error });}
        });
      });
    };

    try {
      let data;
      // case 1: if the user is admin allow to delete in any case
      if (req.tokenData.role === 'admin') {
        data = await PostModel.deleteOne({ _id: postID }, req.body);
      }
      // case 2: if the user ain't admin than check if he create the post
      else {
        data = await PostModel.deleteOne(
          { _id: postID, creator_id: req.tokenData._id },
          req.body
        );
      }
      if (data.deletedCount === 1) {
        deleteCloudinaryImages();
        return res.status(200).json({ data, msg: 'post deleted' });
      }
      return res
        .status(400)
        .json({ data: null, msg: 'user cannot delete this post' });
    } catch (err) {
      console.error(err);
      res.status(400).json({ err });
    }
  },
  countAll: async(req, res) => {
    try {
      let count = await PostModel.countDocuments({});
      res.json({ count });
    } catch (err) {
      res.status(500).json({ msg: 'err', err });
    }
  },
  countMyPosts: async(req, res) => {
    try {
      let count = await PostModel.countDocuments({
        creator_id: req.tokenData._id,
      });
      res.json({ count });
    } catch (err) {
      res.status(500).json({ msg: 'err', err });
    }
  },
  search: async(req, res) => {
    let perPage = Math.min(req.query.perPage, 20) || 15;
    let page = req.query.page || 1;
    let sort = req.query.sort || 'createdAt';
    let reverse = req.query.reverse == 'yes' ? -1 : 1;

    try {
      // query params
      let searchQ = checkUndefinedOrNull(req.query?.searchQ)
        ? ''
        : req.query.searchQ;
      let max = checkUndefinedOrNull(req.query?.max) ? MAX : req.query.max;
      let min = checkUndefinedOrNull(req.query?.min) ? MIN : req.query?.min;
      let categories = checkUndefinedOrNull(req.query?.categories)
        ? null
        : req.query?.categories.split(',');
      // regex search ignore case sensitive
      let searchReg = new RegExp(searchQ, 'i');
      let posts;
      posts = categories?.length
        ? await PostModel.find({
          title: { $regex: searchReg },
          price: { $gte: min, $lt: max },
          category_url: { $in: categories },
        })
          .limit(perPage)
          .skip((page - 1) * perPage)
          .sort({ [sort]: reverse })
          .populate({ path: 'likes', select })
          .populate({ path: 'creator_id', select })
        : await PostModel.find({
          title: { $regex: searchReg },
          price: { $gte: min, $lt: max },
        })
          .limit(perPage)
          .skip((page - 1) * perPage)
          .sort({ [sort]: reverse })
          .populate({ path: 'likes', select })
          .populate({ path: 'creator_id', select });
      res.json({ count: posts.length, posts });
    } catch (err) {
      res.status(500).json({ err: err });
    }
  },
  changeActive: async(req, res) => {
    try {
      let postID = req.params.postID;
      if (postID == config.superID) {
        return res
          .status(401)
          .json({ msg: 'You cant change superadmin to user' });
      }
      let post = await PostModel.findOne({ _id: postID });
      post.active = !post.active;
      post.updatedAt = new Date(Date.now() + 2 * 60 * 60 * 1000);
      post.save();

      return res.json(post);
    } catch (err) {
      res.status(500).json({ msg: 'err', err });
    }
  },
  userPosts: async(req, res) => {
    let perPage = Math.min(req.query.perPage, 20) || 10;
    let page = req.query.page || 1;
    let sort = req.query.sort || 'createdAt';
    let reverse = req.query.reverse == 'yes' ? -1 : 1;
    try {
      let id = req.params.userID;
      let posts = await PostModel.find({ creator_id: id })
        .limit(perPage)
        .skip((page - 1) * perPage)
        .sort({ [sort]: reverse })
        .populate({ path: 'creator_id', select });
      res.json(posts);
    } catch (err) {
      res.status(500).json({ err: err });
    }
  },
  changeRange: async(req, res) => {
    if (!req.body.range && req.body.range != false) {
      return res.status(400).json({ msg: 'Need to send range in body' });
    }
    if (req.body.range != 'long-term' && req.body.range != 'short-term') {
      return res.status(400).json({ msg: 'Range must be long/short-term' });
    }
    try {
      let postID = req.params.postID;
      let data;
      if (postID == config.superID) {
        return res
          .status(401)
          .json({ msg: 'You cant change superadmin to user' });
      }
      if (req.tokenData.role === 'admin') {
        data = await PostModel.updateOne(
          { _id: postID },
          { range: req.body.range }
        );
      } else {
        data = await PostModel.updateOne(
          { _id: postID, creator_id: req.tokenData._id },
          { range: req.body.range }
        );
      }
      // update the change time
      let post = await PostModel.findOne({ _id: postID });
      post.updatedAt = new Date(Date.now() + 2 * 60 * 60 * 1000);
      post.save();
      return res.json(data);
    } catch (err) {
      res.status(500).json({ msg: 'err', err });
    }
  },
  likePost: async(req, res) => {
    // find user by id
    let user = await UserModel.findById(req.tokenData._id);
    // get post from query params
    let postID = req.params.postID;
    // find the current post by id and get likes object from ID by populate
    let post = await PostModel.findOne({ _id: postID })
      .populate({ path: 'likes', select })
      .populate({ path: 'creator_id', select });

    // if the user found in the array setup found true else false
    const found = post.likes.some((el) => String(el.id) === req.tokenData._id);
    if (!found) {
      // add to array of likes
      post.likes.unshift(req.tokenData._id);
      await post.save();

      // check if the post already in wish list
      const inWishlist = user.wishList.some((el) => el === postID);
      // check two cases -
      // 1. case 1 : if post not in wish list
      // 2. case 2 : creator can't move to wish list his items
      if (!inWishlist && String(post.creator_id._id) !== req.tokenData._id) {
        user.wishList.unshift(post._id);
        await user.save();
      }
      return res
        .status(201)
        .json({ posts: post.likes, post: post, msg: 'You like the post' });
    }

    // remove from post like the user.
    post.likes = post.likes.filter((e) => String(e._id) !== req.tokenData._id);
    await post.save();

    // wish list remove item
    user.wishList = user.wishList.filter((el) => String(el) !== postID);
    await user.save();
    res.status(201).json({ posts: post.likes, msg: 'unlike the post' });
  },
  countLikes: async(req, res) => {
    try {
      let postID = req.params.postID;
      let post = await PostModel.findOne({ _id: postID });
      let likes = await post.likes;
      res.json({ count: likes.length });
    } catch (err) {
      res.status(500).json({ msg: 'err', err });
    }
  },
  topThreeLikes: async(req, res) => {
    try {
      let postID = req.params.postID;
      let post = await PostModel.findOne({ _id: postID });
      res.json({ likes: post.likes.splice(0, 3) });
    } catch (err) {
      res.status(500).json({ msg: 'err', err });
    }
  },
  onCancelDel: async(req, res) => {
    let images = req.body;
    let details = {
      cloud_name: config.cloudinary_post_name,
      api_key: config.cloudinary_post_key,
      api_secret: config.cloudinary_post_secret,
      type: 'upload',
    };
    try {
      images.forEach((img) => {
        cloudinary.uploader.destroy(img.img_id, details, (error, result) => {
          if (error) {return res.json({ error });}
        });
      });
      return res.json({ msg: 'delete all images succeed' });
    } catch (err) {
      res.status(500).json({ msg: 'err', err });
    }
  },
  singlePostImgDelete: async(req, res) => {
    let { postID, imgID } = req.params;
    let details = {
      cloud_name: config.cloudinary_post_name,
      api_key: config.cloudinary_post_key,
      api_secret: config.cloudinary_post_secret,
      type: 'upload',
    };
    let post = await PostModel.findById(postID);
    post.img.filter((img) => {
      img.img_id !== imgID;
    });
    await post.save();
    cloudinary.uploader.destroy(imgID, details, (error, result) => {
      if (error) {return res.json({ error });}
    });
    return res.json({ msg: 'delete all images succeed' });
  },
  countByCategory: async(req, res) => {
    try {
      const countMap = {};
      let posts = await PostModel.find({});
      let arrayOfCategories = posts.map(post => post.category_url);

      // Count occurrences of each item
      arrayOfCategories.forEach(category => {
        if (countMap[category]) {
          countMap[category] += 1;
        } else {
          countMap[category] = 1;
        }
      });

      // Convert the countMap to an array of objects
      const catogoriesCount = Object.keys(countMap).map(key => {
        return { name: key, count: countMap[key] };
      });

      return res.json(catogoriesCount);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'err', err });
    }
  }
};
