/*
  passport.js
  This file is used to authenticate user login.
 */

const LocalStrategy = require('passport-local').Strategy;

const bcrypt = require('bcryptjs');

const database = require('./database');

module.exports = (passport) => {
  // Set up passport session
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // Used to serialize the user for the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Used to deserialize the user
  passport.deserializeUser((id, done) => {
    database.query(`SELECT * FROM user WHERE id = ${id}`, (err, results) => {
      done(err, results[0]);
    });
  });

  // Local sign in
  passport.use('local', new LocalStrategy({
    // By default, local strategy uses username and password, we will override with email
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true    // Allows us to pass back the entire request to the callback
  }, (req, email, password, done) => {
    // Callback with email and password from our form
    let sqlQuery = `SELECT * FROM user WHERE email = '${email}'`;
    console.log(sqlQuery);
    database.query(sqlQuery, (err, results) => {
      if (err) {
        return done(err);
      }

      if (!results.length) {
        // req.flash is the way to set flashdata using connect-flash
        return done(null, false, req.flash('error_msg', 'User not found, please double-check credentials'));
      }

      // If the user is found but the password is wrong
      if (!bcrypt.compareSync(password, results[0].password)) {
        // Create the loginMessage and save it to session as flashdata
        return done(null, false, req.flash('error_msg', 'Wrong password'));
      }

      // All is well, return successful user
      return done(null, results[0]);
    });
  }));
};
