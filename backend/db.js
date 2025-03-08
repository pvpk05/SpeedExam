const mysql = require('mysql2/promise');


const db = mysql.createPool({
  host: '194.238.17.64',
  user: 'ramanasoft',
  password: "Ramanasoft@123",
  database: 'speedexam'
});

db.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the GLOBAL database');
    connection.release();
  }
});

module.exports = db;