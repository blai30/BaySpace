/*
  index.js
  This is the back-end of the home page for the app.
 */

const express = require('express');
const database = require('../config/database');

const router = express.Router();

const title = 'BaySpace | CSC 648 Team 05';

// Routes index.hbs page to / or /index (main page)
router.get('/', (req, res, next) => {
  // Fetch all rows from the location table
  let sqlQuery = 'SELECT * FROM location';

  // Preview query in console
  console.log(sqlQuery);

  // Execute MySQL query in database to fetch results
  database.query(sqlQuery, (err, result) => {
    if (err) {
      res.render({
        title: title
      });
      next();
    }

    // Preview all fetched results
    console.log(result);

    // Render the page with all of the locations
    res.render('index', {
      title: title,
      locations: result
    });
  });
});

router.get('/location/:urlRoute', (req, res, next) => {
  // Store the route to this location in a variable
  let urlRoute = req.params.urlRoute;

  // Query the database for information on this specific location
  database.query(`SELECT * FROM location WHERE urlRoute = '${urlRoute}'`, (err, result) => {
    // Render page with no information if there is an error
    if (err) {
      res.render('location', {
        title: `Park information: ${urlRoute}`
      });
      next();
    }

    // Preview this location's information in the console
    console.log(result[0]);

    // Render the page and pass information on this location to the front end
    res.render('location', {
      title: `Park information: ${urlRoute}`,
      // We are taking index 0 because the database query will always return only one row so we can just take the first and only result
      location: result[0]
    });
  });
});

module.exports = router;
