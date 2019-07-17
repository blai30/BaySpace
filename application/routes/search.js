const express = require('express');
const database = require('../database');

const router = express.Router();

function search(req, res, next) {
  const searchTerm = req.query.search;
  const issuesCategory = req.query.issuesCategory;
  const locationsCategory = req.query.locationsCategory;

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

  // If a search term is entered
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

  console.log(sqlQuery);

  // Display search results
  database.query(sqlQuery, (err, result) => {
    if (err) {
      req.searchResult = '';
      req.searchTerm = '';
      // req.searchCategory = '';
      next();
    }

    req.searchResult = result;
    req.searchTerm = searchTerm;
    // req.searchCategory = '';

    next();
  });
}

// Routes search.hbs page to /search
router.get('/', search, (req, res, next) => {
  let searchResult = req.searchResult;
  // The values are passed to search.hbs
  res.render('search', {
    title: 'Search Database',
    numResults: searchResult.length,
    results: searchResult
  });
});

module.exports = router;
