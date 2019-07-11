const mysql = require('mysql');

// Connect to database
const database = mysql.createConnection({
  host: 'localhost',  // THIS WILL ONLY WORK WHEN THIS FILE RUNS FROM THE SERVER
  user: 'root',
  password: 'admin',
  database: 'team5app'
});

database.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL database');
});

module.exports = database;
