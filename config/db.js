const mysql = require('mysql2');

const pool = mysql.createPool({
  host: '127.0.0.1',  // Ensure this is correct
  user: 'root',       // Your MySQL username
  password: 'newpassword',       // Your MySQL password (if any)
  database: 'vcms',     // ❌ Incorrect database name?
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool.promise();
