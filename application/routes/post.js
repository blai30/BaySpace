/*
  post.js
  This is the back-end of the tickets page for the app. The tickets page displays all tickets stored on the database using a MySQL query. Tickets may also be added from this page with an accompanying image.
 */

const express = require('express');
const path = require('path');

const database = require('../config/database');
const upload = require('../config/multer');
const recaptcha = require('../controllers/recaptcha');

const router = express.Router();

const title = 'Post ticket';

// Routes tickets.hbs page to /tickets
router.get('/', (req, res, next) => {
  res.render('post', {
    title: title
  });
});

// This is for adding items to database
router.post('/', [
  upload,
  recaptcha
] , (req, res, next) => {
  /*
    UPLOADING IMAGE TO SERVER AND ADDING IMAGE TO DATABASE
   */
  // Retrieve uploaded file from the request
  const uploadedFile = req.file;

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

    // Print contents of body (form submission values)
    console.log(req.body);

    // Insert newImage into database table 'image'
    let query = database.query('INSERT INTO image SET ?', newImage, (err, result) => {
      if (err) {
        console.log('Error inserting newImage into image');
        throw err;
      }

      console.log(result);
      console.log(`result.insertId: ${result.insertId}`);

      /*
        ADDING NEW TICKET TO DATABASE WITH UPLOADED IMAGE
      */
      // Create new ticket object to be inserted into database table 'ticket'
      let newTicket = {
        issue_id: req.body.issue_id,
        location_id: req.body.location_id,
        description: (!req.body.description) ? 'no details' : req.body.description,
        rating: (!req.body.rating) ? '1' : req.body.rating,
        image_id: result.insertId   // Image id is the id of the new uploaded image
      };

      // Insert newTicket into database table 'ticket'
      let query = database.query('INSERT INTO ticket SET ?', newTicket, (err, result) => {
        if (err) {
          console.log('Error inserting newTicket into ticket');
          throw err;
        }

        console.log(result);
        req.flash('success_msg', 'Ticket has been posted successfully.');
      });

      console.log(query.sql);
    });
  } else {  // NO IMAGE WAS UPLOADED OR ERROR UPLOADING IMAGE
    /*
      ADDING NEW TICKET TO DATABASE WITH NO IMAGE
    */
    // Create new ticket object to be inserted into database table 'ticket'
    let newTicket = {
      issue_id: req.body.issue_id,
      location_id: req.body.location_id,
      description: (!req.body.description) ? 'no details' : req.body.description,
      rating: (!req.body.rating) ? '1' : req.body.rating,
      image_id: 0   // Image id is 0 by default if no image was uploaded
    };

    // Insert newTicket into database table 'ticket'
    let query = database.query('INSERT INTO ticket SET ?', newTicket, (err, result) => {
      if (err) {
        console.log('Error inserting newTicket into ticket');
        throw err;
      }

      console.log(result);
      req.flash('success_msg', 'Ticket has been posted successfully.');
      res.redirect('/post');
    });

    console.log(query.sql);
  }
});

module.exports = router;
