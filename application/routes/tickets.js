const express = require('express');
const database = require('../database');

const router = express.Router();

// Routes tickets.hbs page to /tickets
router.get('/', (req, res, next) => {
  // Display ticket table
  // The JOINs are used to fetch tables by foreign key
  let sqlQuery =
    'SELECT ' +
      'issue.issueName, ' +
      'location.locationName, ' +
      'ticket.status, ' +
      'ticket.description, ' +
      'ticket.rating, ' +
      'ticket.time, ' +
      'user.userName ' +
    'FROM ticket ' +
      'LEFT JOIN issue ' +
        'ON (ticket.issue_id = issue.id) ' +
      'LEFT JOIN location ' +
        'ON (ticket.location_id = location.id) ' +
      'LEFT JOIN user ' +
        'ON (ticket.user_id = user.id)';
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

  // Display updated ticket table
  // The JOINs are used to fetch tables by foreign key
  let sqlQuery2 =
    'SELECT ' +
      'issue.issueName, ' +
      'location.locationName, ' +
      'ticket.status, ' +
      'ticket.description, ' +
      'ticket.rating, ' +
      'ticket.time, ' +
      'user.userName ' +
    'FROM ticket ' +
      'LEFT JOIN issue ' +
        'ON (ticket.issue_id = issue.id) ' +
      'LEFT JOIN location ' +
        'ON (ticket.location_id = location.id) ' +
      'LEFT JOIN user ' +
        'ON (ticket.user_id = user.id)';
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
