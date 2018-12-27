const express = require('express');

// connects to database
var db = require('./db.js');

const addEventRouter = express.Router();

// GET method route for the addEvents page.
// It serves addEvents.html present in client folder
addEventRouter.get('/',function(req, res) {
  if (!req.session.value) {
	  res.redirect('/login');
  } else {
  	res.sendFile(__dirname + '/client/addEvent.html');
  }
});

// POST method to insert details of a new event to tbl_events table
addEventRouter.post('/postEvent', function(req, res) {
    var query = "INSERT INTO tbl_events (event_name, event_location, event_date) values ('" + req.body.event_name + "', '" + req.body.event_location + "', '" + req.body.event_date + "')";
    db.query(query, function(err, result, fields) {
	if (err) throw err;
	if (!err)
	    console.log("table updated");
    });
    res.redirect('/calendar');
});


module.exports = addEventRouter;
