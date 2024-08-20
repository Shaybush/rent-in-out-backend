import Joi from 'joi';

// TODO - req body should have type
export const validateUser = (reqBody) => {
	const joiSchema = Joi.object({
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
		cover_img: Joi.object().allow(null, ''),
	});
	return joiSchema.validate(reqBody);
};

// TODO - req body should have type
export const validateUserLogin = (reqBody) => {
	const joiSchema = Joi.object({
		email: Joi.string().email().min(2).max(35).required(),
		password: Joi.string().min(2).max(25).required(),
	});

	return joiSchema.validate(reqBody);
};
