import Joi from 'joi';

interface IReqBodyCategoryModel {
  name: string
  url_name: string
  info: string
}

export const validateCategory = (reqBody: IReqBodyCategoryModel) => {
  let joiSchema = Joi.object({
    name: Joi.string().min(2).max(99).required(),
    url_name: Joi.string().min(2).max(99).required(),
    info: Joi.string().min(2).max(500).required(),
  });
  return joiSchema.validate(reqBody);
};