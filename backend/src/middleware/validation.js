const Joi = require('joi');

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};

const schemas = {
  login: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
  }),

  menuItem: Joi.object({
    name: Joi.string().required().max(255),
    description: Joi.string().allow('').max(500),
    price: Joi.number().positive().required(),
    category: Joi.string().required().max(100),
    available: Joi.boolean().default(true),
    image_url: Joi.string().uri().allow('')
  }),

  order: Joi.object({
    table_id: Joi.number().integer().positive().required(),
    items: Joi.array().items(
      Joi.object({
        menu_item_id: Joi.number().integer().positive().required(),
        quantity: Joi.number().integer().positive().required(),
        notes: Joi.string().allow('').max(255)
      })
    ).min(1).required(),
    notes: Joi.string().allow('').max(500)
  }),

  payment: Joi.object({
    payment_method: Joi.string().valid('cash', 'card').required(),
    amount_received: Joi.number().positive().required()
  })
};

module.exports = {
  validateRequest,
  schemas
};