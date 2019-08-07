/*
  recaptcha.js
  This file exports a function to be used as a handler in POST methods.
  This function verifies Google reCAPTCHA request and returns a response.
 */

const request = require('request');

/**
 * Function to verify Google reCAPTCHA. This function is called as a handler in POST for /register router.
 * @param req The request sent to the server from the browser
 * @param res The response sent to the browser from the server
 * @param next Finish response
 */
module.exports = (req, res, next) => {
  /*
    VERIFY GOOGLE RECAPTCHA REQUEST
   */

  // Google reCAPTCHA secret key
  let secretKey = '6LemrbEUAAAAAPfWOtagix9eeZpYi5l3n20Wv8Or';

  // req.connection.remoteAddress will provide IP address of connected user
  let verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body['g-recaptcha-response']}&remoteip=${req.connection.remoteAddress}`;

  // Hitting GET request to the URL, Google will respond with success or error scenario
  request(verificationUrl, (error, response, body) => {
    if (error) {
      throw error;
    }

    // Parse response
    body = JSON.parse(body);
    console.log(`Captcha verification response:`);
    console.log(body);

    // Success will be true or false depending upon captcha validation
    if ((body.success !== undefined) && !body.success) {
      // Error scenario
      console.log('Error verifying Google reCAPTCHA');
    }

    // Success scenario
    console.log('Successfully verified Google reCAPTCHA');

    next();
  });
};
