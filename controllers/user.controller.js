const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Models
const { User } = require('../models/user.model');
const { Order } = require('../models/order.model');
const { Restaurant } = require('../models/restaurant.model');

// Utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

const signup = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  const salt = await bcrypt.genSalt(12);
  const hashPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    name,
    email,
    password: hashPassword,
  });

  newUser.password = undefined;

  res.status(201).json({ newUser });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email, status: 'enabled' } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Invalid credentials', 400));
  }

  const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  user.password = undefined;
  res.status(200).json({ token, user });
});

const updateUser = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { name } = req.body;
  const { email } = req.body;
  const userUpdated = await user.update({ name, email });
  res.status(200).json({ status: 'success', userUpdated });
});

const deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;
  await user.update({ status: 'disabled' });
  res.status(200).json({ status: 'success' });
});

const getAllOrdersUser = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const userId = sessionUser.id;
  const orders = await Order.findAll({
    where: { userId },
    include: { model: Restaurant },
  });
  res.status(200).json({ orders });
});

const getByIdOrderUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { sessionUser } = req;
  const userId = sessionUser.id;
  const order = await Order.findOne({
    where: { id, userId },
    include: { model: Restaurant },
  });
  res.status(200).json({ order });
});

module.exports = {
  signup,
  login,
  updateUser,
  deleteUser,
  getAllOrdersUser,
  getByIdOrderUser,
};
