const express = require('express');

const router = express.Router();

// Routes signin.hbs page to /signin
router.get('/', (req, res, next) => {
  res.render('signin', { title: 'Sign In Team 05' });
});

module.exports = router;
