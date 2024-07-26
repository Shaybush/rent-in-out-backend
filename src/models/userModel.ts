import mongoose from 'mongoose';

const cloudinary = { url: String, img_id: String };
const rank = {
  user_id: String,
  rank: Number,
};
const userSchema = new mongoose.Schema({
  fullName: {
    firstName: String,
    lastName: String,
  },
  email: String,
  password: String,
  password_changed: Date,
  phone: String,
  profile_img: {
    type: cloudinary,
    default: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Blank_Earth_Banner.jpg',
      img_id: '',
    },
  },
  cover_img: {
    type: cloudinary,
    default: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Blank_Earth_Banner.jpg',
      img_id: '',
    },
  },
  country: String,
  city: String,
  birthdate: Date,
  role: {
    type: String,
    default: 'user',
  },
  active: {
    type: Boolean,
    default: false,
  },
  rank: {
    type: [rank],
    default: [],
  },
  productsList: {
    type: [String],
    default: [],
  },
  wishList: {
    type: [mongoose.Types.ObjectId],
    ref: 'posts',
  },
  messages: {
    type: [mongoose.Types.ObjectId],
    ref: 'messages'
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

export const UserModel = mongoose.model('users', userSchema);
