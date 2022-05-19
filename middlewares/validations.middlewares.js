const { body } = require('express-validator');
const { validationResult } = require('express-validator');

const createUserValidations = [
  body('name').notEmpty().withMessage('Name cannot be empty'),
  body('email')
    .notEmpty()
    .withMessage('Email cannot be empty')
    .isEmail()
    .withMessage('Must be a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password cannot be empty')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
];

const createRestaurantValidations = [
  body('name').notEmpty().withMessage('Name cannot be empty'),
  body('address').notEmpty().withMessage('Address cannot be empty'),
  body('rating').notEmpty().withMessage('Rating cannot be empty'),
];

const createMealValidations = [
  body('name').notEmpty().withMessage('Name cannot be empty'),
  body('price').notEmpty().withMessage('Price cannot be empty'),
];

const createOrderValidations = [
  body('userId').notEmpty().withMessage('User cannot be empty'),
  body('quantity').notEmpty().withMessage('Quantity cannot be empty'),
];

const checkValidations = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const messages = errors.array().map(({ msg }) => msg);

    const errorMsg = messages.join('. ');

    return res.status(400).json({
      status: 'error',
      message: errorMsg,
    });
  }
  next();
};

module.exports = {
  createUserValidations,
  checkValidations,
  createRestaurantValidations,
  createMealValidations,
  createOrderValidations,
};
