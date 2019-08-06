/*
  search.js
  This is the back-end of the search page for the app. The search functionality uses MySQL queries to fetch information on database tables.
 */

const express = require('express');
const { check, validationResult } = require('express-validator');
const database = require('../config/database');

const router = express.Router();

/**
 * This function is used for the search page to show search results
 * @param req The request sent to the server from the browser
 * @param res The response sent to the browser from the server
 * @param next Finish response
 */
function search(req, res, next) {
  // Read values from user input from front end
  const searchTerm = req.body.searchTerm;
  const issuesCategory = req.body.issuesCategory;
  const locationsCategory = req.body.locationsCategory;

  // Default search query; if no search term was entered
  let sqlQuery =
    'SELECT ' +
      'image.imagePath, ' +
      'issue.issueName, ' +
      'location.locationName, ' +
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
    'ORDER BY ticket.time DESC';

  // If a search term is entered, add additional filters based on user input from front end
  if (searchTerm !== '') {
    sqlQuery += 'WHERE (issue.issueName LIKE ' + `'%${searchTerm}%' OR location.locationName LIKE ` + `'%${searchTerm}%' OR ticket.description LIKE ` + `'%${searchTerm}') `;

    if (issuesCategory !== '') {
      sqlQuery += `AND (issue.issueName = '${issuesCategory}') `;
    }

    if (locationsCategory !== '') {
      sqlQuery += `AND (location.locationName = '${locationsCategory}') `;
    }
  } else {
    if (issuesCategory !== '') {
      sqlQuery += `WHERE (issue.issueName = '${issuesCategory}') `;
    }

    if (locationsCategory !== '') {
      if (issuesCategory === '') {
        sqlQuery += `WHERE (location.locationName = '${locationsCategory}') `;
      } else {
        sqlQuery += `AND (location.locationName = '${locationsCategory}') `;
      }
    }
  }

  // Preview query in console
  console.log(sqlQuery);

  // Display search results
  database.query(sqlQuery, (err, result) => {
    if (err) {
      req.searchResult = '';
      req.searchTerm = '';
      next();
    }

    req.searchResult = result;
    req.searchTerm = searchTerm;

    // Log results in console (JSON format)
    console.log(result);

    next();
  });
}

/**
 * This function is used for ticket details pages when clicking on more details
 * @param req The request sent to the server from the browser
 * @param res The response sent to the browser from the server
 * @param next Finish response
 */
function ticketDetails(req, res, next) {
  let ticketId = req.params.id;

  // Get all information about the ticket by ticket id (it will return only one result)
  let sqlQuery =
    'SELECT ' +
      'image.imagePath, ' +
      'issue.issueName, ' +
      'location.locationName, ' +
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
    'WHERE ticket.id = ' + ticketId;

  // Preview ticket id and sql query in console
  console.log(`Getting ticket id: ${ticketId}`);
  console.log(sqlQuery);

  // Get ticket from MySQL database table where ticket id is the ticket that the user clicked on
  database.query(sqlQuery, (err, result) => {
    if (err) {
      req.ticketResult = '';
      console.log(err);
      next();
    }

    // Since we are viewing details of one ticket, we only need the one and only result from the sql query
    req.ticketResult = result[0];

    // Log result to console (JSON format)
    console.log(result[0]);

    next();
  });
}

// Routes search.hbs page to /search
router.get('/', (req, res, next) => {
  res.render('search', {
    title: 'Search Database'
  });
});

// Routes details page of each ticket with id to /search/details/id
router.get('/details/:id', ticketDetails, (req, res, next) => {
  // Render new details page for the ticket
  res.render('details', {
    title: `Details for ticket id: ${req.params.id}`,
    ticket: req.ticketResult    // This should not be null if the page is accessed via more details
  });
});

// When user clicks search button, post is called
router.post('/', [
  // Validate search field to be max 50 characters
  check('searchTerm', 'Search term must be 50 characters or less.')
    .isLength({
      max: 50
    }),

  // The search function that was defined in this file
  search
], (req, res, next) => {
  let searchResult = req.searchResult;

  // Pass any validation errors to front-end, in this case search term <=50 characters
  let errors = validationResult(req);

  // The values are passed to search.hbs
  res.render('search', {
    title: 'Search Database',
    searchTerm: req.body.searchTerm,  // Persist search query
    numResults: searchResult.length,
    results: searchResult,            // Pass results to front end
    msg: (searchResult.length <= 0) ? 'No results found.' : '',   // Display message when no results

    errors: errors.array()  // Validation errors will be shown if there are any
  });
});

module.exports = router;
