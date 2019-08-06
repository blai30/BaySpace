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

module.exports = router;
