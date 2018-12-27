const express = require('express');

// native js function for hashing messages with the SHA-1 algorithm
var sha1 = require('sha1');

// connects to database
var db = require('./db.js');

const loginRouter = express.Router();

// GET method route for the login page.
// It serves login.html present in client folder
loginRouter.get('/',function(req, res) {
 res.sendFile(__dirname + '/client/login.html');
});

// GET method route for the login page.
// It serves login.html present in client folder
loginRouter.get('/fail',function(req, res) {
  if (req.session.fail === 1) 
    res.send('fail');
});

// POST method to validate user login
// upon successful login, user session is created
loginRouter.post('/sendLoginDetails', function(req, res) {
  var sha_pw = sha1(req.body.password);
  var query = "SELECT * FROM tbl_accounts";
	db.query(query, function(err, result, fields) {
	if (err) throw err;
	var valid = false;
	for (var i=0; i<result.length; i++) {
		if (sha_pw === result[i].acc_password && req.body.username === result[i].acc_login) {
			valid = true;
		} 
	}
	if (valid === true) {
		console.log("Login successful");
		req.session.value = 1;
		req.session.username = req.body.username;
		req.session.fail = 0;
		res.redirect('/calendar');	
	} else {
		req.session.fail = 1;
		res.redirect('/login');
		console.log("login failed");
	}
  });
});

module.exports = loginRouter;
