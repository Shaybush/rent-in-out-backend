import mongoose from 'mongoose';

interface Cloudinary {
  url: string;
  img_id: string;
}

interface Rank {
  user_id: string;
  rank: number;
}

export interface IUser extends Document {
  fullName: {
    firstName: string;
    lastName: string;
  };
  email: string;
  password: string;
  password_changed: Date;
  phone: string;
  profile_img: Cloudinary;
  cover_img: Cloudinary;
  country: string;
  city: string;
  birthdate: Date;
  role: string;
  active: boolean;
  rank: Rank[];
  productsList: string[];
  wishList: mongoose.Types.ObjectId[];
  messages: mongoose.Types.ObjectId[];
  createdAt: number;
  updatedAt: number;
}