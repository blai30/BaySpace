const express = require('express');
const path = require('path');
const database = require('../database');
const upload = require('../multer');

const router = express.Router();

function displayTickets(req, res) {
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
        'ON (ticket.image_id = image.id) ' +
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
      tickets: results,
      data: req.body
    });
  });
}

// Routes tickets.hbs page to /tickets
router.get('/', (req, res, next) => {
  displayTickets(req, res);
});

// This is for adding items to database
router.post('/', upload, (req, res, next) => {
  /*
    UPLOADING IMAGE TO SERVER AND ADDING IMAGE TO DATABASE
   */
  // Retrieve uploaded file from the request
  const uploadedFile = req.file;

  // ID of the image to be used when inserting new ticket, default is 0
  let newImageId = 0;

  // Uploaded file is not undefined
  if (uploadedFile) {
    console.log(`Uploaded file: ${uploadedFile.filename}`);
    console.log(`Original file: ${uploadedFile.originalname}`);

    // Create new image object to be inserted into database table 'image'
    let newImage = {
      imageName: uploadedFile.filename,
      imagePath: `uploads/${uploadedFile.filename}`,
      imageType: path.extname(uploadedFile.originalname)
    };
    console.log(newImage);

    // Insert newImage into database table 'image'
    let query = database.query('INSERT INTO image SET ?', newImage, (err, result) => {
      if (err) {
        console.log('Error inserting newImage into image');
        throw err;
      }
      console.log(result);
      console.log(`result.insertId: ${result.insertId}`);

      // Store the id of the image that was just inserted
      newImageId = result.insertId;
    });
    console.log(query.sql);
  }

  // Print contents of body (form submission values)
  console.log(req.body);

  /*
    ADDING NEW TICKET TO DATABASE
   */
  // Create new ticket object to be inserted into database table 'ticket'
  let newTicket = {
    issue_id: req.body.issue_id,
    location_id: req.body.location_id,
    description: (!req.body.description) ? 'no details' : req.body.description,
    rating: (!req.body.rating) ? '1' : req.body.rating,
    image_id: newImageId  // Here is the id of the image that was just uploaded and inserted into database. 0 if image did not get inserted to table 'image'
  };

  // Insert newTicket into database table 'ticket'
  let query = database.query('INSERT INTO ticket SET ?', newTicket, (err, result) => {
    if (err) {
      console.log('Error inserting newTicket into ticket');
      throw err;
    }
    console.log(result);
  });
  console.log(query.sql);

  // Display table of tickets
  displayTickets(req, res);
});

module.exports = router;
