/*
  passport.js
  This file is used to authenticate user login.
 */

const LocalStrategy = require('passport-local').Strategy;

const bcrypt = require('bcryptjs');

const database = require('./database');

module.exports = (passport) => {
  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser((id, done) => {
    database.query(`SELECT * FROM user WHERE id = ${id}`, (err, results) => {
      done(err, results[0]);
    });
  });

  // =========================================================================
  // LOCAL SIGNUP ============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'
  passport.use('local-signup', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
  }, (req, email, password, done) => {
    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists
    database.query(`SELECT * FROM user WHERE email = '${email}'`, (err, results) => {
      console.log(results);
      console.log("above row object");

      if (err) {
        return done(err);
      }

      if (results.length) {
        return done(null, false, req.flash('error_msg', 'That email is already taken'));
      } else {
        // if there is no user with that email
        // create the user
        let newUser = {};

        newUser.email = email;
        newUser.password = password; // use the generateHash function in our user model

        let sqlQuery = `INSERT INTO user (email, password) values ('${email}', '${password}')`;
        console.log(sqlQuery);
        database.query(sqlQuery, (err, results) => {
          return done(null, newUser);
        });
      }
    });
  }));

  // =========================================================================
  // LOCAL LOGIN =============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'
  passport.use('local-signin', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true    // allows us to pass back the entire request to the callback
  }, (req, email, password, done) => {
    // callback with email and password from our form
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

      // if the user is found but the password is wrong
      if (!bcrypt.compareSync(password, results[0].password)) {
        // create the loginMessage and save it to session as flashdata
        return done(null, false, req.flash('error_msg', 'Wrong password'));
      }

      // all is well, return successful user
      return done(null, results[0]);
    });
  }));
};
