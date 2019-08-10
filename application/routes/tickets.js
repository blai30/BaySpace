/*
  tickets.js
  For admin use to view all tickets. Admin is able to update ticket status and/or delete the ticket entirely.
 */

const express = require('express');

const database = require('../config/database');

const router = express.Router();

/**
 * This function checks if user is signed in and is an admin, otherwise redirect them to home page
 * @param req The request sent to the server from the browser
 * @param res The response sent to the browser from the server
 * @param next Finish response
 */
function ensureAuthenticated(req, res, next) {
  // Checking isAuthenticated is required before the MySQL query because of the user id
  if (req.isAuthenticated()) {
    // Query signed in user rank by id
    let sqlQuery = `SELECT rank FROM user WHERE (id = '${req.user.id}' AND rank = '3')`;
    console.log(sqlQuery);

    // Fetched signed in user rank by id
    database.query(sqlQuery, (err, result) => {
      if (err) {
        throw err;
      }

      // Preview the user's rank in console
      console.log(result);

      // User authenticated to be an admin, let them pass
      if (result) {
        return next();
      } else {
        // Redirect user to home page if not an admin
        req.flash('error_msg', 'You must be signed in as an administrator to view this page');
        res.redirect('/');
      }
    });
  } else {
    // Redirect user to home page if not signed in
    req.flash('error_msg', 'You must be signed in as an administrator to view this page');
    res.redirect('/');
  }
  /*
    These else blocks are required both times because NodeJS is asynchronous and does not wait for MySQL queries
    Also because req.user.id is undefined if the user is not signed in
   */
}

/**
 * This function is used to display all tickets from the database to the admin
 * @param req The request sent to the server from the browser
 * @param res The response sent to the browser from the server
 * @param next Finish response
 */
function getTickets(req, res, next) {
  // Query to display all tickets in the database
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
    'ORDER BY ticket.time DESC ';

  // All tickets from database fetched
  database.query(sqlQuery, (err, results) => {
    if (err) {
      req.tickets = '';
      console.log(err);
      next();
    }

    // Store results in request
    req.tickets = results;

    // Preview all tickets in console
    console.log(results);

    next();
  });
}

/**
 * This function is used by the admin to update the status of a ticket
 * @param req The request sent to the server from the browser
 * @param res The response sent to the browser from the server
 * @param next Finish response
 */
function updateTicket(req, res, next) {
  // Query to update ticket status by id
  let sqlQuery = `UPDATE ticket SET status = '${req.body.changeStatus}' WHERE id = '${req.params.id}'`;

  // Ticket status gets updated
  database.query(sqlQuery, (err, result) => {
    if (err) {
      console.log(err);
      next();
    }

    // Log the result of ticket getting updated to console
    console.log(result);

    next();
  });
}

/**
 * This function is used by the admin to delete a ticket from the database
 * @param req The request sent to the server from the browser
 * @param res The response sent to the browser from the server
 * @param next Finish response
 */
function deleteTicket(req, res, next) {
  // Query to delete ticket by id
  let sqlQuery = `DELETE FROM ticket WHERE id = '${req.params.id}'`;

  // Ticket gets deleted
  database.query(sqlQuery, (err, result) => {
    if (err) {
      console.log(err);
      next();
    }

    // Log the result of ticket getting deleted to console
    console.log(result);

    next();
  });
}

// Routes tickets.hbs page to /tickets
router.get('/', [
  ensureAuthenticated,
  getTickets
], (req, res, next) => {
  // Display tickets table
  res.render('tickets', {
    title: 'Tickets',
    tickets: req.tickets
  });
});

// Post request to update ticket status by id, then redirects admin back to tickets page
router.post('/update/:id', [
  ensureAuthenticated,
  updateTicket
], (req, res, next) => {
  req.flash('success_msg', 'Ticket status updated');
  res.redirect('/tickets');
});

// Post request to delete ticket by id, then redirects admin back to tickets page
router.post('/delete/:id', [
  ensureAuthenticated,
  deleteTicket
], (req, res, next) => {
  req.flash('success_msg', 'Ticket deleted');
  res.redirect('/tickets');
});

module.exports = router;
