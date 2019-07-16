const mysql = require('mysql');

// Connect to database
const database = mysql.createConnection({
  // !!! IMPORTANT !!!
  // RUN 'npm run dev' TO TEST ON LOCAL DEVELOPMENT MACHINE
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'admin',
  port: process.env.DB_PORT,  // DB PORT WILL BE 33306 WHEN USING 'npm run dev', OR 3306 WHEN RUNNING ON SERVER
  // !!! IMPORTANT !!!
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
