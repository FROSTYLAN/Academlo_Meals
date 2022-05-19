const express = require('express');
const { db } = require('./utils/database');

// Controllers
const { globalErrorHandler } = require('./controllers/errors.controller');

// Routers
const { usersRouter } = require('./routes/users.routes');
const { restaurantsRouter } = require('./routes/restaurants.routes');
const { mealsRouter } = require('./routes/meals.routes');
const { ordersRouter } = require('./routes/orders.routes');

const app = express();

// Enable incoming JSON data
app.use(express.json());

//Endpoint
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/restaurants', restaurantsRouter);
app.use('/api/v1/meals', mealsRouter);
app.use('/api/v1/orders', ordersRouter);

// Global error handler
app.use('*', globalErrorHandler);

// Models
const { User } = require('./models/user.model');
const { Restaurant } = require('./models/restaurant.model');
const { Meal } = require('./models/meal.model');
const { Order } = require('./models/order.model');
const { Review } = require('./models/review.model');

db.authenticate()
  .then(() => {
    console.log('Database authenticated');
  })
  .catch(err => console.log(err));

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

db.sync()
  .then(() => {
    console.log('Database synced');
  })
  .catch(err => console.log(err));

// Spin up server
const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Express app running on port: ${PORT}`);
});
