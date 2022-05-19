const express = require('express');

// Middlewares
const {
  protectToken,
  protectAccountOwner,
  userExists,
} = require('../middlewares/users.middlewares');
const {
  checkValidations,
  createOrderValidations,
} = require('../middlewares/validations.middlewares');
const { orderExists } = require('../middlewares/orders.middlewares');

// Controllers
const {
  createOrder,
  getAllOrder,
  orderCompleted,
  orderCancelled,
} = require('../controllers/order.controller');

const router = express.Router();

router.use(protectToken, userExists);

router.post('/', createOrderValidations, checkValidations, createOrder);

router.get('/me', getAllOrder);

router
  .route('/:id')
  .patch(protectAccountOwner, orderExists, orderCompleted)
  .delete(protectAccountOwner, orderExists, orderCancelled);

module.exports = { ordersRouter: router };
