// include the express module
var express = require("express");

// create an express application
var app = express();

// helps in extracting the body portion of an incoming request stream
var bodyparser = require('body-parser');

// fs module - provides an API for interacting with the file system
var fs = require("fs");

// helps in managing user sessions
var session = require('express-session');

// apply the body-parser middleware to all incoming requests
app.use(bodyparser());

// use express-session
// in mremory session is sufficient for this assignment
app.use(session({
  secret: "csci4131secretkey",
  saveUninitialized: true,
  resave: false}
));


// sets up routers for the pages
const loginRouter = require('./login.js');
app.use('/login', loginRouter);
const calendarRouter = require('./calendar.js');
app.use('/calendar', calendarRouter);
const addEventRouter = require('./addEvent.js');
app.use('/addEvent', addEventRouter);
const adminRouter = require('./admin.js');
app.use('/admin', adminRouter);


// server listens on port 9007 for incoming connections
app.listen(9007, () => console.log('Listening on port 9007!'));

// GET method route for welcome page
// It serves welcome.html present in client folder
app.get('/',function(req, res) {
	res.sendFile(__dirname + '/client/welcome.html');
});

// GET method to return the session username
app.get('/getCurrentUser', function(req, res) {
	res.send(req.session.username);
});

// log out of the application
// destroy user session
app.get('/logout', function(req, res) {
  if (!req.session.value) {
	  res.redirect('/login');
  } else {
	  req.session.value -= 1;
	  req.session.destroy();
	  res.redirect('/login');
  }
});

// middle ware to serve static files
app.use('/client', express.static(__dirname + '/client'));

// function to return the 404 message and error to client
app.get('*', function(req, res) {
  // add details
});
