const { Meal } = require('../models/meal.model');
const { Restaurant } = require('../models/restaurant.model');

//Utils
const { catchAsync } = require('../utils/catchAsync');

const createMeal = catchAsync(async (req, res, next) => {
  const { name, price } = req.body;
  const { id } = req.params;

  const newMeal = await Meal.create({ name, price, restaurantId: id });
  res.status(200).json({ newMeal });
});

const getAllMeals = catchAsync(async (req, res, next) => {
  const meals = await Meal.findAll({ include: { model: Restaurant } });
  res.status(200).json({ meals });
});

const GetMealById = catchAsync(async (req, res, next) => {
  const { meal } = req;
  res.status(200).json({ meal });
});

const updateMeal = catchAsync(async (req, res, next) => {
  const { meal } = req;
  const { name, price } = req.body;

  await meal.update({ name, price });

  meal.Restaurant = undefined;

  res.status(200).json({ status: 'success' });
});

const deleteMeal = catchAsync(async (req, res, next) => {
  const { meal } = req;

  await meal.update({ status: 'disabled' });

  meal.Restaurant = undefined;

  res.status(200).json({ status: 'success' });
});

module.exports = {
  getAllMeals,
  createMeal,
  GetMealById,
  updateMeal,
  deleteMeal,
};
