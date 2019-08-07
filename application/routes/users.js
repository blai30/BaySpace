/*
  users.js
  This is the back-end for all user account related pages. Sign-in/login and register functionality are written here.
 */

const express = require('express');
const { body, check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const passport = require('passport');

const database = require('../config/database');
const recaptcha = require('../controllers/recaptcha');

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

// Routes sign out link to sign the user out
router.get('/signout', (req, res, next) => {
  req.logout();
  req.flash('success_msg', 'Successfully signed out');
  res.redirect('/users/signin');
});

// Submitted sign in form sends POST request
router.post('/signin', [
  // Check valid email
  check('email', 'Email is invalid.')
    .isEmail(),

  // Check email length
  check('email', 'Email must be 4-80 characters.')
    .isLength({
      min: 4,
      max: 80
    }),

  // Check password length and match
  check('password', 'Password must be 4-40 characters.')
    .isLength({
      min: 4,
      max: 40
    })
], passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/signin',
  failureFlash: true
}), (req, res, next) => {
  console.log(req);
  next();
});

// Submitted registration form sends POST request
router.post('/register', [
  /*
    FIELD VALIDATION OPTIONS
   */

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

  // Check if username is already registered in the system
  check('userName')
    .custom(userName => {
      let sqlQuery = `SELECT * FROM user WHERE userName = '${userName}'`;
      // Must use promise here when querying database because it may be slow
      return new Promise((resolve, reject) => {
        database.query(sqlQuery, (err, results) => {
          if (err) {
            console.log('Server error');
          }

          console.log(results);

          // Reject if username already exists in database
          if (results.length) {
            reject(new Error('That username is already registered.'));
          }

          // Check passes if the username does not exist in database
          resolve(true);
        });
      });
    }),

  // Check valid email
  check('email', 'Email is invalid.')
    .isEmail(),

  // Check email length
  check('email', 'Email must be 4-80 characters')
    .isLength({
      min: 4,
      max: 80
    }),

  // Check if email is already registered in the system
  check('email')
    .custom(email => {
      let sqlQuery = `SELECT * FROM user WHERE email = '${email}'`;
      // Must use promise here when querying database because it may be slow
      return new Promise((resolve, reject) => {
        database.query(sqlQuery, (err, results) => {
          if (err) {
            console.log('Server error');
          }

          console.log(results);

          // Reject if email already exists in database
          if (results.length) {
            reject(new Error('That email is already registered.'));
          }

          // Check passes if the email does not exist in database
          resolve(true);
        });
      });
    }),

  // Check password length and match
  check('password', 'Password is required to be 4-40 characters.')
    .isLength({
      min: 4,
      max: 40
    })
    .custom((value, {req}) => {
      if (value !== req.body.password2) {
        // Throw error if passwords do not match
        throw new Error('Passwords do not match.');
      }
      return true;
    })
], recaptcha, (req, res, next) => {   // recaptcha function is called as a handler here
  /*
    FIELD VALIDATION
   */

  // Grab the input fields and store them in variables
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const userName = req.body.userName;
  const email = req.body.email;
  const password = req.body.password;

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
