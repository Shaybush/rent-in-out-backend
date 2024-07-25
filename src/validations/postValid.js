const Joi = require('joi');

exports.validatePost = (_reqBody) => {
  let cloudinary = Joi.object().keys({
    url: Joi.string().required(),
    img_id: Joi.string().required()
  });
  let joiSchema = Joi.object({
    title : Joi.string().min(2).max(50).required(),
    info : Joi.string().min(2).max(1500).required(),
    range : Joi.string().valid('long-term','short-term').allow(null,''),
    price : Joi.number().min(1).max(10000000).required(),
    type : Joi.string().valid('rent','exchange','delivery').allow(null,''),
    available_from : Joi.date().allow(null,''),
    country : Joi.string().min(2).max(50).required(),
    city: Joi.string().min(2).max(50).required(),
    category_url : Joi.string().min(2).max(50).required(),
    img : Joi.array().items(cloudinary),
    collect_points : Joi.array().items()
  });
  return joiSchema.validate(_reqBody);
};