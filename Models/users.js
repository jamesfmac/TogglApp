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
				user.email = result.rows[0].email;
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
				user.email = result.rows[0].email;
				callback(null, user);
			} else {
				callback(null, null);
			}
		}

	);
};


//returns the full user including API key
user.findFullUserById = function(userid, callback) {
	var userId = userid;
	console.log('find findFullUserById called with id ' + userId);
	pool.query('Select u.first_name, u.last_name, u.id, apk.api_key, u.email from users u left join users_api_keys apk on u.id = apk.user_id where u.id =  $1', [userId], function(err, result) {
			console.log('query result was ' + result);
			if (err) {
				callback(new Error('database error ' + err));
			} else if (result.rows.length === 1) {
				user.firstName = result.rows[0].first_name;
				user.lastName = result.rows[0].last_name;
				user.id = result.rows[0].id;
				user.email = result.rows[0].email;
				user.apiKey = result.rows[0].api_key;
				callback(null, user);
			} else {
				callback(null, null);
			}
		}

	);
};

//updates the passed in user id with content from data
user.updateUserDetails = function(userid, data, callback) {
	console.log('updateUserDetails called with id ' + userid + ' and data ' + data.firstname + data.apikey);

	//setups the transactions to make sure that either both pass or fail and we don't get partial updates 
	pool.query('Begin', function(err) {
		if (err) return rollback(pool, done);

		process.nextTick(function() {

			var user = [userid, data.email, data.firstname, data.lastname];
			var userapi = [userid, data.apikey];

			pool.query('Update users set email = ($2), first_name = ($3), last_name = ($4) where id = ($1)', user, function(err, result) {
				//rollbacks might fail, not sure why 'done' needs to be passed through
				if (err) {
					console.log ('db error found 1');
					return db.rollback(pool, done);
				}
				//attempts to insert and if already exists updates the API Key for the user 
				pool.query('INSERT INTO users_api_keys (user_id,api_key) VALUES ($1,$2) ON CONFLICT (user_id) DO UPDATE SET api_key = ($2)', userapi, function(err, result) {
					if (err) {
						console.log ('db error found 2');
						return db.rollback(pool, done);

					}
					console.log('api key updated to ' + userapi[1]);
					console.log('user update resulted in ' + result);
					pool.query('COMMIT');
					callback(err,user);
				});
			});
		});
	});
};


//take a user ID and password and compare against the db
user.checkPassword = function(userid, password, cb) {
	console.log('pssword check called');
	pool.query('select password from users where id = $1', [userid], function(err, result) {
		if (err) {
			return onError(err);
		} else if (result.rows.length === 1) {
			console.log('entered password = ' + password);
			console.log('stored password = ' + result.rows[0]);
			bcrypt.compare(password, result.rows[0].password, function(err, res) {
				if (err) {
					console.log('error with password checks');
					return onError(err);

				} else if (res) {
					console.log('password matched ' + res);
					return cb(null, user);
				} else {
					cb(null, false);
				}
			});
		}
	});
};

//check that user is authenticated

user.ensureAuthenticated = function(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
};


module.exports = {

	findUserByName: user.findUserByName,
	findFullUserById: user.findFullUserById,
	checkPassword: user.checkPassword,
	findUserById: user.findUserById,
	mock: user.mock,
	ensureAuthenticated: user.ensureAuthenticated,
	updateUserDetails: user.updateUserDetails
};