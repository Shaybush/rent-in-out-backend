import Joi from 'joi';

// TODO - req body should have type
export const validateCategory = (reqBody) => {
	const joiSchema = Joi.object({
		name: Joi.string().min(2).max(99).required(),
		url_name: Joi.string().min(2).max(99).required(),
		info: Joi.string().min(2).max(500).required(),
	});
	return joiSchema.validate(reqBody);
};
