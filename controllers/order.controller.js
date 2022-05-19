const { Order } = require('../models/order.model');
const { Meal } = require('../models/meal.model');
const { Restaurant } = require('../models/restaurant.model');

//Utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

const createOrder = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const { mealId, quantity } = req.body;
  const meal = await Meal.findOne({
    where: { id: mealId, status: 'available' },
  });
  if (!meal) {
    return next(new AppError('Meal does not exist with given Id', 404));
  }

  const price = meal.price * quantity;

  const newOrder = await Order.create({
    mealId,
    userId: sessionUser,
    quantity,
    price,
  });

  res.status(200).json({ newOrder });
});

const getAllOrder = catchAsync(async (req, res, next) => {
  const orders = await Order.findAll({ include: { Restaurant, Meal } });
  res.status(200).json({ orders });
});

const orderCompleted = catchAsync(async (req, res, next) => {
  const { order } = req;
  await order.update({ status: 'completed' });
  res.status(200).json({ status: 'success' });
});

const orderCancelled = catchAsync(async (req, res, next) => {
  const { order } = req;
  await order.update({ status: 'cancelled' });
  res.status(200).json({ status: 'success' });
});

module.exports = { createOrder, getAllOrder, orderCompleted, orderCancelled };
