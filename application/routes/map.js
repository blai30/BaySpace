/*
  map.js
 */

const express = require('express');

const database = require('../config/database');

const router = express.Router();

/**
 * This function is used to get a list of all locations available in the database and the number of tickets for each location
 * @param req The request sent to the server from the browser
 * @param res The response sent to the browser from the server
 * @param next Finish response
 */
function getLocations(req, res, next) {
  // Query all locations and the number of tickets for each location
  let sqlQuery =
    'SELECT location.*, ' +
      'count(ticket.location_id) as numTickets ' +
    'FROM location ' +
      'LEFT JOIN ticket ' +
        'ON (location.id = ticket.location_id) ' +
    'GROUP BY location.id ';

  // All locations fetched
  database.query(sqlQuery, (err, results) => {
    if (err) {
      req.locationList = '';
      console.log(err);
      next();
    }

    // Store results in request
    req.locationList = results;

    // Preview results in console
    console.log(results);

    next();
  });
}

// Routes map.hbs page to /map and pass in list of locations to front-end
router.get('/', getLocations, (req, res, next) => {
  res.render('map', {
    title: 'Map',
    locations: req.locationList
  });
});

module.exports = router;
