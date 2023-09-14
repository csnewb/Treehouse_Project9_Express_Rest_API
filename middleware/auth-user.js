'use strict';

const auth = require('basic-auth');
const { User } = require('../models');
const bcrypt = require('bcrypt');

/**
 * Middleware to authenticate the request using Basic Authentication.
 * @param {Request} req - The Express Request object.
 * @param {Response} res - The Express Response object.
 * @param {Function} next - The function to call to pass execution to the next middleware.
 */
exports.authenticateUser = async (req, res, next) => {
  let message;

  console.log(`req.headers:`)
  console.log(req.headers)

  const credentials = auth(req);



  if (credentials) {
    console.log(`if Credentials is True`)
    const email = credentials.name;
    const password = credentials.password;

    console.log(`credentials: ${credentials}`);
    console.log(`email: ${email}`);
    console.log(`password: ${password}`);

    const user = await User.findOne({ where: {emailAddress: email} });
    if (user) {
      console.log(`if User is True`)
      const authenticated = bcrypt
        .compareSync(credentials.pass, user.password);
      if (authenticated) {
        console.log(`user: ${user.firstName} is Authenticated`);

        // Store the user on the Request object.
        req.currentUser = user;
      } else {
        message = `Authentication failure for username: ${user.firstName}`;
      }
    } else {
      message = `User not found for username: ${credentials.name}`;
    }
  } else {
    message = 'Auth header not found';
  }

  if (message) {
    console.warn(message);
    res.status(401).json({ message: 'Access Denied' });
  } else {
    next();
  }
};