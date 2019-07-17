const express = require('express');
const database = require('../database');
const upload = require('../multer');

const router = express.Router();

// Routes tickets.hbs page to /tickets
router.get('/', (req, res, next) => {
  // Display ticket table
  // The JOINs are used to fetch tables by foreign key
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
        'ON (ticket.image_id = image.id)' +
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
  // MULTER UPLOAD HERE
  upload(req, res, (err) => {
    if (err) {
      res.render('index', {
        msg: err
      });
    } else {
      console.log(req.file);
    }
  });

  // Creating a new ticket with user entered name and location
  let newTicket = {
    issue_id: req.body.issue_id,
    location_id: req.body.location_id,
    description: (!req.body.description) ? 'no details' : req.body.description,
    rating: (!req.body.rating) ? '1' : req.body.rating
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
      'LEFT JOIN image ' +
        'ON (ticket.image_id = image.id)' +
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
      data: req.body
    });
  });
});

module.exports = router;
