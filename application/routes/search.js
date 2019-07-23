const express = require('express');
const database = require('../database');

const router = express.Router();

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
        'ON (ticket.user_id = user.id) ';

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

// Routes search.hbs page to /search
router.get('/', (req, res, next) => {
  res.render('search', {
    title: 'Search Database'
  });
});

// When user clicks search button, post is called
router.post('/', search, (req, res, next) => {
  let searchResult = req.searchResult;
  // The values are passed to search.hbs
  res.render('search', {
    title: 'Search Database',
    searchTerm: req.body.searchTerm,  // Persist search query
    numResults: searchResult.length,
    results: searchResult,            // Pass results to front end
    msg: (searchResult.length <= 0) ? 'No results found.' : ''  // Display message when no results
  });
});

module.exports = router;
