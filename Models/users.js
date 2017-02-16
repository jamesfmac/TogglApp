//import db connection 
var db = require('../config/database.js');
var pool = db.getPool();
var bcrypt = require('bcrypt');

//create a blank user object, should probably become a prototype in the future
var user = {
	id: null,
	firstName: '',
	lastName: ''
	
};

user.mock = {
	id: 16,
	firstName: 'James',
	lastName: 'test'
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
	console.log('find user called');
	pool.query('Select * from users where email = $1', [userName], function(err, result) {
			if (err) {
				callback(new Error('database error ' + err));
			} else if (result.rows.length === 1) {
				user.firstName = result.rows[0].first_name;
				user.lastName = result.rows[0].last_name;
				user.id = result.rows[0].id;
				callback(null, user);
			} else {
				callback(null, null);
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
				callback(null, null);
			}
		}

	);
};


//take a user ID and password and compare against the db
user.checkPassword = function(userid, password, cb) {
	console.log('pssword check called');
	pool.query('select password from users where id = $1', [userid], function(err, result) {

		if (err) {
			return onError(err);
		} else if (result.rows.length === 1) {
			console.log('entered password = '+ password );
			console.log('stored password = '+ result.rows[0] );
			bcrypt.compare(password, result.rows[0].password, function(err, res) {
				if (err) {
					console.log ('error with password checks');
					return onError(err);

				} else if (res){
					console.log('password matched '+ res);
					return cb(null, user);
				} else{
					cb(null, false);
				}


			});
		}

	});
};

//check that user is authenticated

 user.ensureAuthenticated =function(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
};


module.exports = {
	
	findUserByName: user.findUserByName,
	checkPassword: user.checkPassword,
	findUserById: user.findUserById,
	mock: user.mock,
	ensureAuthenticated: user.ensureAuthenticated
};