const express = require('express');

// Middlewares
const {
  protectToken,
  protectAdmin,
  userExists,
} = require('../middlewares/users.middlewares');
const {
  checkValidations,
  createMealValidations,
} = require('../middlewares/validations.middlewares');
const { mealExists } = require('../middlewares/meals.middlewares');

// Controllers
const {
  getAllMeals,
  createMeal,
  GetMealById,
  updateMeal,
  deleteMeal,
} = require('../controllers/meal.controller');

const router = express.Router();

router.get('/', getAllMeals);

router.get('/:id', mealExists, GetMealById);

router.use(protectToken, userExists);

router
  .route('/:id')
  .post(createMealValidations, checkValidations, createMeal)
  .patch(protectAdmin, mealExists, updateMeal)
  .delete(protectAdmin, mealExists, deleteMeal);

module.exports = { mealsRouter: router };
