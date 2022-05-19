const { Restaurant } = require('../models/restaurant.model');
const { Review } = require('../models/review.model');

// Utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

const restaurantExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const restaurant = await Restaurant.findOne({
    where: { id, status: 'active' },
  });

  if (!restaurant) {
    return next(new AppError('Restaurant does not exist with given Id', 404));
  }

  req.restaurant = restaurant;
  next();
});

const reviewExist = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { sessionUser } = req;

  const review = await Review.findOne({
    where: {
      restaurantId: parseInt(id),
      status: 'created',
      userId: sessionUser.id,
    },
  });

  if (!review) {
    return next(new AppError('Review does not exist with given Id', 404));
  }

  req.review = review;
  next();
});

module.exports = { restaurantExists, reviewExist };
