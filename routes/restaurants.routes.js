const express = require('express');

// Middlewares
const {
  protectToken,
  protectAdmin,
  protectAccountOwner,
  userExists,
} = require('../middlewares/users.middlewares');
const {
  createRestaurantValidations,
  checkValidations,
} = require('../middlewares/validations.middlewares');
const {
  restaurantExists,
  reviewExist,
} = require('../middlewares/restaurants.middlewares');

// Controllers
const {
  createRestaurant,
  getAllRestaurant,
  getByIdRestaurant,
  updateRestaurant,
  deleteRestaurant,
  createReview,
  updateReview,
  deleteReview,
} = require('../controllers/restaurant.controller');

const router = express.Router();

router
  .route('/')
  .post(
    protectToken,
    createRestaurantValidations,
    checkValidations,
    createRestaurant
  )
  .get(getAllRestaurant);

router
  .route('/:id')
  .get(getByIdRestaurant)
  .patch(protectToken, protectAdmin, restaurantExists, updateRestaurant)
  .delete(protectToken, protectAdmin, restaurantExists, deleteRestaurant);

router
  .route('/reviews/:id')
  .post(protectToken, createReview)
  .patch(
    protectToken,
    userExists,
    protectAccountOwner,
    reviewExist,
    updateRestaurant
  )
  .delete(
    protectToken,
    userExists,
    protectAccountOwner,
    reviewExist,
    deleteRestaurant
  );

module.exports = { restaurantsRouter: router };
