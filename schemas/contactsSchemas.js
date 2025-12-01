const Joi = require('joi');

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

const favoriteSchema = Joi.object({
  favorite: Joi.boolean().required()
});

function validate(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    next();
  };
}

module.exports = {
  validateAdd: validate(addSchema),
  validateUpdate: validate(updateSchema),
  validateFavorite: validate(favoriteSchema)
};
