/*
  database.js
  This file connects the app to the remote MySQL database using the mysql node library.
  The environment variables are used in development for testing.

  The whole point of the SSH tunnel service is to connect to the remote MySQL database on the
  server when testing development on localhost instead of your own database. That way we can see
  all tickets and users that are stored in the remote database and update the tables on there.
 */

const mysql = require('mysql');
const sshTunnel = require('tunnel-ssh');
const path = require('path');
const fs = require('fs');

// This will only run when 'npm run dev' is used; This should be used when testing on local machine in development, DO NOT USE THIS WHEN RUNNING ON THE AWS SERVER
if (process.env.NODE_ENV === 'dev') {
  // Private SSH key file that is located in /csc648-su19-Team05/credentials/csc648.pem
  const privateKeyPath = path.join(__dirname, '../../credentials/aws-key.pem');
  const privateKeyFile = fs.readFileSync(privateKeyPath);

  const sshTunnelConfig = {
    username: 'ubuntu',            // User in remote AWS server; no password
    privateKey: privateKeyFile,   // Private SSH key used to SSH to remote server
    host: process.env.SSH_HOST,   // Defined in .env file to be 35.209.5.63
    port: 22,                     // This is the SSH connection port
    dstHost: '127.0.0.1',         // MySQL database host for remote AWS server (should be localhost)
    dstPort: 3306,                // This is the port of the MySQL database on remote server
    localHost: '127.0.0.1',       // Localhost for local machine (should be localhost)
    localPort: 33306              // The SSH tunnel will use the 33306 port on local machine, MAKE SURE THIS PORT IS OPEN ON YOUR MACHINE
  };

  // Initiate SSH tunnel service
  sshTunnel(sshTunnelConfig, (error, server) => {
    if (error) {
      console.log(`Failure to create SSH Tunnel to the remote server ${process.env.SSH_HOST}`);
      throw error;
    }
    // Your local machine
    let tunnelSource = server.address().address + ":" + server.address().port;
    // The remote server
    let tunnelDestination = process.env.SSH_HOST + ":3306";
    console.log(`SSH tunnel connection successfully initiated: ${tunnelSource} tunneling to ${tunnelDestination}`);
  });
}

// Create connection configs for MySQL database
const database = mysql.createConnection({
  // !!! IMPORTANT !!!
  // RUN 'npm run dev' TO TEST ON LOCAL DEVELOPMENT MACHINE
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'admin',
  port: process.env.DB_PORT,  // DB PORT WILL BE 33306 WHEN USING 'npm run dev', OR 3306 BY DEFAULT WHEN RUNNING ON SERVER

  database: 'team5app',       // This MySQL database schema must exist on the server
  timezone: 'US/Pacific'
});

// Connect to MySQL database using above configs
database.connect((err) => {
  if (err) {
    throw err;
  }
  console.log(`Connected to MySQL database`);
});

module.exports = database;
