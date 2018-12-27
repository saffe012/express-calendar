const express = require('express');

// connects to database
var db = require('./db.js');

const calendarRouter = express.Router();

// // GET method route for the events page.
// It serves events.html present in client folder
calendarRouter.get('/',function(req, res) {
  if (!req.session.value) {
	res.redirect('/login');
  } else {
        res.sendFile(__dirname + '/client/events.html');
  }
});

// GET method to return the list of events
// The function queries the table events for the list of places and sends the response back to client
calendarRouter.get('/getListOfEvents', function(req, res) {
    db.query('SELECT * FROM tbl_events', function(err, result, fields) {
	if (err) throw err;
	res.send(result);
    });
});

module.exports = calendarRouter;
