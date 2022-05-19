const { Restaurant } = require('../models/restaurant.model');
const { Review } = require('../models/review.model');

//Utils
const { catchAsync } = require('../utils/catchAsync');

const createRestaurant = catchAsync(async (req, res, next) => {
  const { name, address, rating } = req.body;

  const newRestaurant = await Restaurant.create({
    name,
    address,
    rating,
  });

  res.status(201).json({ newRestaurant });
});

const getAllRestaurant = catchAsync(async (req, res, next) => {
  const restaurants = await Restaurant.findAll({
    where: { status: 'active' },
    include: { model: Review },
  });
  res.status(200).json({ restaurants });
});

const getByIdRestaurant = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const restaurant = await Restaurant.findOne({
    where: { id },
    include: { model: Review },
  });
  res.status(200).json({ restaurant });
});

const updateRestaurant = catchAsync(async (req, res, next) => {
  const { restaurant } = req;
  const { name, address } = req.body;
  const restaurantUpdated = await restaurant.update({ name, address });
  res.status(200).json({ status: 'success', restaurantUpdated });
});

const deleteRestaurant = catchAsync(async (req, res, next) => {
  const { restaurant } = req;
  await restaurant.update({ status: 'disabled' });
  res.status(200).json({ status: 'success' });
});

const createReview = catchAsync(async (req, res, next) => {
  const { comment, rating } = req.body;
  const { id } = req.params;
  const { sessionUser } = req;
  const newReview = await Review.create({
    comment,
    rating,
    restaurantId: parseInt(id),
    userId: sessionUser.id,
  });
  res.status(201).json({ newReview });
});

const updateReview = catchAsync(async (req, res, next) => {
  const { comment, rating } = req.body;
  const { review } = req;
  await review.update({ comment, rating });
  res.status(200).json({ status: 'success' });
});

const deleteReview = catchAsync(async (req, res, next) => {
  const { review } = req;
  await review.update({ status: 'deleted' });
  res.status(200).json({ status: 'success' });
});

module.exports = {
  createRestaurant,
  getAllRestaurant,
  getByIdRestaurant,
  updateRestaurant,
  deleteRestaurant,
  createReview,
  updateReview,
  deleteReview,
};
