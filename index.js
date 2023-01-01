// YOU CAN USE THIS FILE AS REFERENCE FOR SERVER DEVELOPMENT

// Include the express module
const express = require('express');

// Helps in managing user sessions
const session = require('express-session');

// include the mysql module
var mysql = require('mysql');

// Bcrypt library for comparing password hashes
const bcrypt = require('bcrypt');

// helps in extracting the body portion of an incoming request stream
var bodyparser = require('body-parser');

const url = require('url');

const port = 9034;

// create an express application
const app = express();
const con = mysql.createConnection({
  host: "localhost",
  user: "fidi1901",               // replace with the database user provided to you
  database: "fidi1901",           // replace with the database user provided to you
});
// apply the body-parser middleware to all incoming requests
app.use(bodyparser());

// Use express-session
// In-memory session is sufficient for this assignment
app.use(session({
  secret: "fsecretkey",
  saveUninitialized: true,
  resave: false
}
));

// middle ware to serve static files
app.use('/client', express.static(__dirname + '/client'));

// server listens on port set to value above for incoming connections
app.listen(port, () => console.log('Listening on port', port));

app.get('/', function (req, res) {

  res.sendFile(__dirname + '/client/welcome.html');
});

// GET method route for the contacts page.
// It serves MyContacts.html present in client folder
app.get('/MyContacts', function (req, res) {
  if (req.session.user) {
    res.sendFile(__dirname + '/client/MyContacts.html');
  }
  else {
    res.redirect(302, "/login");
  }
  // TODO: Add Implementation
});
app.get('/AllContacts', function (req, res) {
  if (req.session.user) {
    res.sendFile(__dirname + "/client/AllContacts.html");
  }
  else {
    res.redirect(302, "/login");
  }
});
app.get('/welcome', function (req, res) {
  res.sendFile(__dirname + '/client/welcome.html')
});
app.get('/Stocks', function (req, res) {
  if (req.session.user) {
    res.sendFile(__dirname + '/client/Stocks.html');
  }
  else {
    res.redirect(302, '/login');
  }
});
app.get('/AddContact', function (req, res) {
  if (req.session.user) {
    res.sendFile(__dirname + '/client/AddContact.html')
  }
  else {
    res.redirect(302, '/login');
  }
});


// TODO: Add implementation for other necessary end-points
app.get('/login', function (req, res) {
  if (req.session.user) {
    res.sendFile(__dirname + '/client/AllContacts.html');
  }
  else {
    res.sendFile(__dirname + '/client/login.html');
  }
});
app.post('/postContactEntry', function (req, res) {
  if (req.session.user) {
    var rowInsert = {
      contact_category: req.body.category,
      contact_name: req.body.name,
      contact_location: req.body.location,
      contact_info: req.body.info,
      contact_email: req.body.email,
      website_title: req.body.website_title,
      website_url: req.body.url
    };
    con.query('INSERT contact_table SET ?', rowInsert, function (err, result) {
      if (err) throw err;
      console.log("Row successfully added.");
    })
    res.redirect(302, '/AllContacts');
  }
  else {
    res.redirect(302, '/login');
  }
});
app.get('/retrieveContacts', function (req, res) {
  var arr = [];
  con.query('SELECT * FROM contact_table ORDER BY contact_name', function (err, rows, fields) {
    for (var i = 0; i < rows.length; i++) {
      arr.push(rows[i]);
    }
    res.json({ data: arr });
  });
});
app.get('/getContacts', function (req, res) {
  var larr = [];
  let cat = req.url.split("?");
  con.query('SELECT * FROM contact_table ORDER BY contact_name', function (err, rows, fields) {
    for (var i = 0; i < rows.length; i++) {
      if (cat[1] == rows[i].contact_category.toLowerCase()) {
        larr.push(rows[i]);
      }
    }
    res.json({ data: larr });
  });
});
app.get('/logout', function (req, res) {
  req.session.destroy();
  res.redirect(302, '/login')
});
app.post('/check-login', function (req, res) {
  var loginInfo = req.body;
  var login = loginInfo.login;
  var pwd = loginInfo.password;
  con.query('SELECT * FROM tbl_accounts where acc_login = ?', [login], function (err, rows, fields) {
    if (err) throw err;
    // Query the database tbl_login with login using a Select Query 
    // SELECT login FROM tbl_login;
    // Provided there is no error, and the results set is assigned to a variable named rows: 
    if (rows.length >= 1) {  // the length should be 0 or 1, but this will work for now
      //var passwordHash = bcrypt.hashSync(pwd, 10);
      if (bcrypt.compareSync(pwd, rows[0].acc_password)) { //compare pwd to rows[0].acc_password – with bycrypt.compareSync/
        //success, set the session, return success
        req.session.user = login;
        res.json({ status: 'success' });

      }
      else
        res.json({ status: 'fail' });
    }
    else
      res.json({ status: 'fail' });
  });
});
// function to return the 404 message and error to client
app.get('*', function (req, res) {
  // add details
  res.sendStatus(404);
});

