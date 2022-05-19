const jwt = require('jsonwebtoken');

// Models
const { User } = require('../models/user.model');

// Utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

const protectToken = catchAsync(async (req, res, next) => {
  let token;
  console.log(req.headers.authorization);
  // Extract token from headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppError('Session invalid', 403));
  }

  //validate token
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  console.log(decoded);

  const user = await User.findOne({
    where: { id: decoded.id, status: 'enabled' },
  });
  if (!user) {
    return AppError('The owner of this token is no longer available, 403');
  }

  req.sessionUser = user;

  next();
});

const protectAdmin = catchAsync(async (req, res, next) => {
  if (req.sessionUser.role !== 'admin') {
    return next(new AppError('Access not granted'));
  }
  next();
});

const userExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findOne({
    where: { id, status: 'enabled' },
    attributes: { exclude: ['password'] },
  });

  if (!user) {
    return next(new AppError('User does not exist with given Id', 404));
  }

  req.user = user;
  next();
});

const protectAccountOwner = catchAsync(async (req, res, next) => {
  const { sessionUser, user } = req;
  if (sessionUser.id !== user.id) {
    return next(new AppError('You do not own this account', 400));
  }
});

module.exports = {
  protectToken,
  protectAdmin,
  userExists,
  protectAccountOwner,
};
