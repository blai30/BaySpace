const express = require('express');
const database = require('../database');

const router = express.Router();

// Routes tickets.hbs page to /tickets
router.get('/', (req, res, next) => {
  let sqlQuery = 'SELECT * FROM ticket';
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
    issue_id: req.body.issue_id,
    location_id: req.body.location_id
  };
  let sqlQuery = 'INSERT INTO ticket SET ?';
  database.query(sqlQuery, newTicket, (err, result) => {
    if (err) {
      throw err;
    }
    console.log(result);
  });

  // Display updated tickets table
  let sqlQuery2 = 'SELECT * FROM ticket';
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
        issue_id: {
          msg: 'What is the issue?'
        },
        location_id: {
          msg: 'Where is it located?'
        }
      }
    });
  });
});

module.exports = router;
