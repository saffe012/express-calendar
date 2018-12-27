const express = require('express');

// native js function for hashing messages with the SHA-1 algorithm
var sha1 = require('sha1');

// connects to database
var db = require('./db.js');

const adminRouter = express.Router();

// GET method to return the list of admins
// The function queries the table admins for the list of users and sends the response back to client
adminRouter.get('/getListOfAdmins', function(req, res) {
    db.query('SELECT * FROM tbl_accounts', function(err, result, fields) {
	if (err) throw err;
	res.send(result);
    });
});

// POST method to add new user
// if user does not already exist, tbl_accounts table will be updated
adminRouter.post('/postUser', function(req, res) {
    var pass = sha1(req.body.acc_password);
    var query = "insert into tbl_accounts (acc_name, acc_login, acc_password) select '" + req.body.acc_name + "', '" + req.body.acc_login + "', '" + pass + "' from tbl_accounts where not exists (select * from tbl_accounts where acc_login='" + req.body.acc_login + "') limit 1";
	db.query(query, function(err, result, fields) {
	if (err) throw err;
	if (!err)
	    console.log("table updated");
    });
    res.redirect('/admin');
});

// POST method to edit user
// if user does not already exist, tbl_accounts table will be updated
adminRouter.post('/editUser', function(req, res) {
    var pass = sha1(req.body.acc_password);
    var query1 = "select * from tbl_accounts";
    var query2 = "UPDATE tbl_accounts SET acc_name = '" + req.body.acc_name + "', acc_login= '" + req.body.acc_login + "', acc_password=  '" + pass + "' WHERE acc_id = " + req.body.acc_id;
    db.query(query1, function(err, result, fields) {
	var valid = true;
	for (var i=0; i<result.length; i++) {
		if (result[i].acc_id != req.body.acc_id && req.body.acc_login === result[i].acc_login) {
			valid = false;
		}
	}
	if (valid) {
    		db.query(query2, function(err, result, fields) {
			if (err) throw err;
			if (!err) {
	    			console.log("table updated");
				res.redirect('/admin');

			}
    		});
	} else {
		res.redirect('/admin_fail');
	}
    });
});

// POST method to delete users
// if the user is not logged in, user will be deleted
adminRouter.post('/deleteUser', function(req, res) {
	if (req.body.user !== req.session.username) {
		var query = "delete from tbl_accounts where acc_login='" + req.body.user + "'";
		db.query(query, function(err, result, fields) {
			if (err) throw err;
		});
	}
	res.redirect('/admin');
});

// GET method route for the admin page.
// It serves admin.html present in client folder
adminRouter.get('/', function(req, res) {
  if (!req.session.value) {
	res.redirect('/login');
  } else {
        res.sendFile(__dirname + '/client/admin.html');
  }
});


module.exports = adminRouter;
