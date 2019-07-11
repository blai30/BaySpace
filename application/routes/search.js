const express = require('express');
const database = require('../database');

const router = express.Router();

function search(req, res, next) {
  const searchTerm = req.query.search;

  let sqlQuery = 'SELECT * FROM tickets';
  if (searchTerm !== '') {
    sqlQuery = `SELECT * FROM tickets WHERE Name LIKE '%` + searchTerm + `%'`;
  }

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

// Even though it says '/', the route is still '/search' because this file is named search.js
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
