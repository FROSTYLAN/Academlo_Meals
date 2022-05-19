const express = require('express');

// Middlewares
const {
  protectToken,
  userExists,
  protectAccountOwner,
} = require('../middlewares/users.middlewares');
const {
  createUserValidations,
  checkValidations,
} = require('../middlewares/validations.middlewares');

// Controllers
const {
  signup,
  login,
  updateUser,
  deleteUser,
  getAllOrdersUser,
  getByIdOrderUser,
} = require('../controllers/user.controller');

const router = express.Router();

router.post('/signup', createUserValidations, checkValidations, signup);
router.post('/login', login);

router.use(protectToken);

router
  .route('/:id')
  .patch(userExists, protectAccountOwner, updateUser)
  .delete(userExists, protectAccountOwner, deleteUser);

router.get('/orders', getAllOrdersUser);
router.get('/orders/:id', getByIdOrderUser);

module.exports = { usersRouter: router };
