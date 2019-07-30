const express = require('express');
const { check, validationResult } = require('express-validator');

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
  check('lastName', 'Last name is required to be 2-40 characters')
    .isLength({
      min: 2,
      max: 40
    }),

  // Check valid email
  check('email', 'Email is invalid')
    .isLength({
      min: 4
    })
    .isEmail(),

  // Check password length and match
  check('password', 'Password is required to be 4-40 characters')
    .isLength({
      min: 4,
      max: 40
    })
    .custom((value,{req, loc, path}) => {
      if (value !== req.body.password2) {
        // trow error if passwords do not match
        throw new Error("Passwords don't match");
      } else {
        return value;
      }
    })
], (req, res, next) => {
  // Grab the input fields and store them in variables
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;
  const password2 = req.body.password2;

  // Handle errors
  let errors = validationResult(req);
  if (errors) {
    console.log('Error in registration');
    console.log(errors);
    res.render('register', {
      // Persist input fields (keep what the user typed instead of erasing it) except password
      firstName: firstName,
      lastName: lastName,
      email: email,

      // Pass error messages to front end
      errors: errors.array()
    });
  } else {
    console.log('Registration successful');
  }
});

module.exports = router;
