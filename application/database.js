const mysql = require('mysql');

// Connect to database
const database = mysql.createConnection({
  host: 'localhost',  // THIS WILL ONLY WORK WHEN THIS FILE RUNS FROM THE SERVER
  user: 'root',
  password: 'admin',
  // port: '33306',      // USE THIS PORT (33306) FOR TESTING ON LOCAL MACHINE, COMMENT THIS LINE OUT WHEN DEPLOYING TO SERVER
  // When testing on local machine, use SSH tunneling first:
  // ssh -N -p 22 -i ./credentials/csc648Summer.pem ubuntu@54.215.173.150 -L 33306:localhost:3306
  // This command assumes you are at the root of the repo: /csc648-su19-Team05/

  database: 'team5app'
});

database.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL database');
});

module.exports = database;
