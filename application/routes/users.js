/*
  users.js
  This is the back-end for all user account related pages. Sign-in/login and register functionality are written here.
 */

const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const request = require('request');

const database = require('../config/database');

const router = express.Router();

// Routes signin.hbs page to /users/signin
router.get('/signin', (req, res, next) => {
  res.render('signin', {
    title: 'Sign In'
  });
});

// Routes register.hbs page to /users/register
router.get('/register', (req, res, next) => {
  res.render('register', {
    title: 'Register'
  });
});

// Submitted registration form sends POST request
router.post('/register', [
  // Validation

  // Check first name length
  check('firstName', 'First name is required to be 2-40 characters.')
    .isLength({
      min: 2,
      max: 40
    }),

  // Check last name length
  check('lastName', 'Last name is required to be 2-40 characters.')
    .isLength({
      min: 2,
      max: 40
    }),

  // Check username length
  check('userName', 'Username is required to be 2-40 characters.')
    .isLength({
      min: 2,
      max: 40
    }),

  // Check valid email
  check('email', 'Email is invalid.')
    .isLength({
      min: 4
    })
    .isEmail(),

  // Check password length and match
  check('password', 'Password is required to be 4-40 characters.')
    .isLength({
      min: 4,
      max: 40
    })
    .custom((value,{req, loc, path}) => {
      if (value !== req.body.password2) {
        // trow error if passwords do not match
        throw new Error("Passwords don't match.");
      } else {
        return value;
      }
    })
], (req, res, next) => {
  // Grab the input fields and store them in variables
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const userName = req.body.userName;
  const email = req.body.email;
  const password = req.body.password;
  const password2 = req.body.password2;

  // Handle errors
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    /*
      ERROR IN REGISTRATION, CANNOT CREATE NEW USER
     */

    console.log('Error in registration');
    console.log(errors);

    // Refresh the page but keep input field values
    res.render('register', {
      // Persist input fields (keep what the user typed instead of erasing it) except password
      firstName: firstName,
      lastName: lastName,
      userName: userName,
      email: email,

      // Pass error messages to front end
      errors: errors.array()
    });
  } else {
    /*
      VERIFY GOOGLE RECAPTCHA REQUEST
     */

    // Google reCAPTCHA secret key
    let secretKey = '6LemrbEUAAAAAPfWOtagix9eeZpYi5l3n20Wv8Or';

    // req.connection.remoteAddress will provide IP address of connected user.
    let verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body['g-recaptcha-response']}&remoteip=${req.connection.remoteAddress}`;

    // Hitting GET request to the URL, Google will respond with success or error scenario.
    request(verificationUrl, (error, response, body) => {
      body = JSON.parse(body);
      console.log(response);
      // Success will be true or false depending upon captcha validation.
      if ((body.success !== undefined) && !body.success) {
        return res.json({
          "responseCode" : 1,
          "responseDesc" : "Failed captcha verification"
        });
      }
      res.json({
        "responseCode" : 0,
        "responseDesc" : "Success"
      });
    });

    /*
      CREATING NEW USER ACCOUNT AND ADDING TO DATABASE
     */

    const saltRounds = 10;
    // Encrypt new user password with hash salts
    bcrypt.hash(password, saltRounds, (err, hash) => {
      // Create new user object to be inserted into database table 'user'
      let newUser = {
        firstName: firstName,
        lastName: lastName,
        userName: userName,
        email: email,
        password: hash
      };

      // Insert newUser into database table 'user'
      let query = database.query('INSERT INTO user SET ?', newUser, (err, result) => {
        if (err) {
          console.log('Error inserting newUser into user');
          throw err;
        }

        console.log(result);
      });

      console.log(query.sql);

      req.flash('success_msg', 'Thank you for registering! You may now sign in.');
      res.redirect('/users/signin');
    });

    console.log('Registration successful');
  }
});

module.exports = router;
