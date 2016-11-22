//import db connection 
var db = require('../config/database.js');
var pool = db.getPool();

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


user.findOne = function(email) {
	pool.query('Select * from users where email = $1', [email], function(err, result) {

			if (err) {
				return onError(err);
			} else if (result.rows.length === 1) {
				user.firstName = result.rows[0].first_name;
				user.lastName = result.rows[0].last_name;
				user.id = result.rows[0].id;
				return(user);
			} else {
				console.log('no users found');
			}

		}

	);
};



module.exports = {
	getPool: function() {
		if (pool) return pool; // if it is already there, grab it here
		pool = new Pool(config);
		return pool;
	},
	findOne: user.findOne
};