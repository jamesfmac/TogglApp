//import db connection 
var db = require('../config/database.js');
var pool = db.getPool();
var bcrypt = require('bcrypt');

//create a blank user object, should probably become a prototype in the future
var user = {
	firstName: '',
	lastName: '',
	id: null
};

//error handling, stolen from some site
var onError = function(err) {
	console.log(err.message, err.stack);
	res.writeHead(500, {
		'content-type': 'text/plain'
	});
	res.end('An error occurred');
};

//find a matching user via email 
user.findUserByName = function(username, callback) {
	var userName = username;
	pool.query('Select * from users where email = $1', [userName], function(err, result) {
			if (err) {
				callback(new Error('database error ' + err));
			} else if (result.rows.length === 1) {
				user.firstName = result.rows[0].first_name;
				user.lastName = result.rows[0].last_name;
				user.id = result.rows[0].id;
				callback(null, user);
			} else {
				callback(new Error('user ' + userName + ' not found'));
			}
		}

	);
};


//find a matching user by id 
user.findUserById = function(userid, callback) {
	var userId = userid;
	console.log('find user called');
	pool.query('Select * from users where id = $1', [userId], function(err, result) {
			if (err) {
				callback(new Error('database error ' + err));
			} else if (result.rows.length === 1) {
				user.firstName = result.rows[0].first_name;
				user.lastName = result.rows[0].last_name;
				user.id = result.rows[0].id;
				callback(null, user);
			} else {
				callback(new Error('user ' + userName + ' not found'));
			}
		}

	);
};


//take a user ID and password and compare against the db
user.checkPassword = function(userid, password) {
	console.log('pssword check called');
	pool.query('select password from users where id = $1', [userid], function(err, result) {

		if (err) {
			return onError(err);
		} else if (result.rows.length === 1) {
			bcrypt.compare(password, result.rows[0].password, function(err, res) {
				if (err) {
					return onError(err);

				} else {
					return (res);
				}

			});
		}

	});
};


module.exports = {
	
	findUserByName: user.findUserByName,
	checkPassword: user.checkPassword,
	findUserById: user.findUserById
};