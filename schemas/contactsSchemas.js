import Joi from "joi";

const addSchema = Joi.object({
  name: Joi.string().min(1).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(5).required()
});

const updateSchema = Joi.object({
  name: Joi.string().min(1),
  email: Joi.string().email(),
  phone: Joi.string().min(5)
}).min(1);

export { addSchema, updateSchema };
