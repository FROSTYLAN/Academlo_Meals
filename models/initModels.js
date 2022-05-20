const { Meal } = require('./meal.model');
const { Order } = require('./order.model');
const { Restaurant } = require('./restaurant.model');
const { Review } = require('./review.model');
const { User } = require('./user.model');

const initModels = () => {
  /********* Establish models relations **********/

  // 1 User <---> M Review
  User.hasMany(Review);
  Review.belongsTo(User);

  // 1 User <--->   M Order
  User.hasMany(Order);
  Order.belongsTo(User);

  // 1 Order <---> 1 Meal
  Meal.hasOne(Order);
  Order.belongsTo(Meal);

  //  1 restaurant <---> M Meal
  Restaurant.hasMany(Meal);
  Meal.belongsTo(Restaurant);

  // 1 Restaurant <---> M Review
  Restaurant.hasMany(Review);
  Review.belongsTo(Restaurant);

  /********* /Establish models relations **********/
};

module.exports = { initModels };
