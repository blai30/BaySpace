/*
  index.js
  This is the back-end of the home page for the app.
 */

const express = require('express');
const database = require('../config/database');

const router = express.Router();

const title = 'BaySpace | CSC 648 Team 05';

/**
 * This function is used for location details pages when clicking on a location
 * @param req The request sent to the server from the browser
 * @param res The response sent to the browser from the server
 * @param next Finish response
 */
function locationDetails(req, res, next) {
  // Store the route to this location in a variable
  let urlRoute = req.params.urlRoute;

  // Query the database for information on this specific location
  let sqlQuery = `SELECT * FROM location WHERE urlRoute = '${urlRoute}'`;
  database.query(sqlQuery, (err, result) => {
    // Render page with no information if there is an error
    if (err) {
      req.locationResult = '';
      console.log(err);
      next();
    }

    // We receive only one result which is the location by this url route
    req.locationResult = result[0];

    // Preview this location's information in the console
    console.log(result[0]);

    next();
  });
}

/**
 * This function is used to display all tickets that are in this location
 * @param req The request sent to the server from the browser
 * @param res The response sent to the browser from the server
 * @param next Finish response
 */
function getLocationTickets(req, res, next) {
  // Get this location
  let urlRoute = req.params.urlRoute;

  // Query all tickets in this location
  let sqlQuery =
    'SELECT ' +
      'image.imagePath, ' +
      'issue.issueName, ' +
      'location.locationName, ' +
      'location.urlRoute, ' +
      'ticket.id, ' +
      'ticket.status, ' +
      'ticket.description, ' +
      'ticket.rating, ' +
      'ticket.time, ' +
      'user.userName ' +
    'FROM ticket ' +
      'LEFT JOIN image ' +
        'ON (ticket.image_id = image.id) ' +
      'LEFT JOIN issue ' +
        'ON (ticket.issue_id = issue.id) ' +
      'LEFT JOIN location ' +
        'ON (ticket.location_id = location.id) ' +
      'LEFT JOIN user ' +
        'ON (ticket.user_id = user.id) ' +
    `WHERE location.urlRoute = '${urlRoute}' ` +
    'ORDER BY ticket.time DESC ';

  // All tickets in this location fetched
  database.query(sqlQuery, (err, results) => {
    if (err) {
      req.locationTickets = '';
      console.log(err);
      next();
    }

    // Store this location's tickets in request
    req.locationTickets = results;

    // Print tickets to console
    console.log(results);

    next();
  });
}

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

// Routes each dedicated location page to their own url (ie. /location/alcatrazIsland)
router.get('/location/:urlRoute', [
  locationDetails,
  getLocationTickets
], (req, res, next) => {
  // Render the page and pass information on this location to the front end
  res.render('location', {
    title: `Park information: ${req.locationResult.locationName}`,
    location: req.locationResult,
    tickets: req.locationTickets
  });
});

module.exports = router;
