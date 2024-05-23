const mongoose = require("mongoose");

const cloudinary = { url: String, img_id: String };
const postSchema = new mongoose.Schema({
  title: String,
  info: String,
  img: {
    type: [cloudinary],
    default: [],
  },
  range: {
    type: String,
    enum: ["long-term", "short-term"],
    default: "short-term",
  },
  creator_id: {
    type: mongoose.Types.ObjectId ,
    ref: "users"
},
  category_url: {
    type: String,
    default: "skate",
  },
  price: Number,
  type: {
    type: String,
    enum: ["rent", "exchange", "delivery"],
    default: "rent",
  },
  collect_points:[],
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
  category_url: String,
  likes: {
    type: [mongoose.Types.ObjectId],
    ref: "users",
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

exports.PostModel = mongoose.model("posts", postSchema);
