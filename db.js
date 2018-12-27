var mysql = require('mysql');
var db_settings = require('./db_settings.json');
var db;

function connectDatabase() {
	if (!db) {
		// creates new mysql connection
		db = mysql.createConnection(db_settings);
		db.connect(function(err) {
			if (!err) {
				console.log("Connected to MYSQL database!");
			} else {
				throw err;
			}
		});
	}
	return db;
}

module.exports = connectDatabase();
