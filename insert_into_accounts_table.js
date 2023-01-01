/*
TO DO:
-----
READ ALL COMMENTS AND REPLACE VALUES ACCORDINGLY
*/

const mysql = require("mysql");
const bcrypt = require('bcrypt');

const dbCon = mysql.createConnection({
  host: "localhost",
  user: "fidi1901",               // replace with the database user provided to you
  database: "fidi1901",           // replace with the database user provided to you
});

console.log("Attempting database connection");
dbCon.connect(function (err) {
  if (err) {
    throw err;
  }

  console.log("Connected to database!");

  const saltRounds = 10;
  const myPlaintextPassword = 'pass';// replace with acc_password chosen by you OR retain the same value
  const passwordHash = bcrypt.hashSync(myPlaintextPassword, saltRounds);

  const rowToBeInserted = {
    acc_name: 'user',            // replace with acc_name chosen by you OR retain the same value
    acc_login: 'user',           // replace with acc_login chosen by you OR retain the same value
    acc_password: passwordHash
  };

  console.log("Attempting to insert record into tbl_accounts");
  dbCon.query('INSERT tbl_accounts SET ?', rowToBeInserted, function (err, result) {
    if (err) {
      throw err;
    }
    console.log("Table record inserted!");
  });

  dbCon.end();
});
