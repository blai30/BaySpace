const express = require('express');
const database = require('../database');

const router = express.Router();

// Route is '/tickets'
router.get('/', (req, res, next) => {
  let sqlQuery = 'SELECT * FROM tickets';
  database.query(sqlQuery, (err, results, fields) => {
    if (err) {
      throw err;
    }

    console.log('Fetched tickets table from database');
    console.log(results);

    // Display tickets table
    res.render('tickets', {
      title: 'All tickets',
      tickets: results
    });
  });
});

// This is for adding items to database
router.post('/', (req, res) => {
  // Creating a new ticket with user entered name and location
  let newTicket = {
    name: req.body.name,
    location: req.body.location
  };
  let sqlQuery = 'INSERT INTO tickets SET ?';
  database.query(sqlQuery, newTicket, (err, result) => {
    if (err) {
      throw err;
    }
    console.log(result);
  });

  // Display updated tickets table
  let sqlQuery2 = 'SELECT * FROM tickets';
  database.query(sqlQuery2, (err, results, fields) => {
    if (err) {
      throw err;
    }

    console.log('Fetched tickets table from database');
    console.log(results);

    res.render('tickets', {
      title: 'All tickets',
      tickets: results,

      data: req.body,
      errors: {
        name: {
          msg: 'What is the issue?'
        },
        location: {
          msg: 'Where is it located?'
        }
      }
    });
  });
});

module.exports = router;
