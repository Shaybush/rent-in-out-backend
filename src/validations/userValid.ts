import Joi from 'joi';
import { ICloudinaryModel } from './postValid';

interface IFullName {
  firstName: string;
  lastName: string;
}

interface IReqBodyUserModel {
  fullName: IFullName;
  email: string;
  password: string;
  phone: string;
  birthdate: Date | string | number;
  country: string;
  city: string;
  profile_img?: ICloudinaryModel
  cover_img?: ICloudinaryModel
}

interface IReqBodyUserLoginModel {
  email: string
  password: string
}

export const validateUser = (_reqBody: IReqBodyUserModel) => {
  let joiSchema = Joi.object({
    fullName: {
      firstName: Joi.string().min(2).max(25).required(),
      lastName: Joi.string().min(2).max(25).required(),
    },
    email: Joi.string().email().min(2).max(25).required(),
    password: Joi.string().min(2).max(25).required(),
    phone: Joi.string().min(8).max(15).required(),
    birthdate: Joi.date().required(),
    country: Joi.string().min(2).max(99).required(),
    city: Joi.string().min(2).max(99).required(),
    profile_img: Joi.object().allow(null, ''),
    cover_img: Joi.object().allow(null, '')
  });
  return joiSchema.validate(_reqBody);
};


export const validateUserLogin = (_reqBody: IReqBodyUserLoginModel) => {
  let joiSchema = Joi.object({
    email: Joi.string().email().min(2).max(35).required(),
    password: Joi.string().min(2).max(25).required(),
  });

  return joiSchema.validate(_reqBody);
};
