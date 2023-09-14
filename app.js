'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');


// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// Define db and validate connection and models
const db = require('./models')
const { User, Course } = db;

// Run `.associate` if it exists
// this can also be done inside the model files
for (const modelName in db.sequelize.models) {
  if (db.sequelize.models[modelName].associate) {
    db.sequelize.models[modelName].associate(db.sequelize.models);
  }
}

module.exports = {
  User,
  Course
};

// Authenticate the connection
db.sequelize.authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });



// create the Express app
const app = express();

// Setup request body JSON parsing.
app.use(express.json());

// setup morgan which gives us http request logging
app.use(morgan('dev'));

// import our routes

const userRoutes = require('./routes/userRoutes');
const courseRoutes  = require('./routes/courseRoutes');


app.use('/api', userRoutes);
app.use('/api', courseRoutes);



// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
