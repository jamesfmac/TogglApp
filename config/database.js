var Pool = require('pg').Pool;
var pool;
var config = {
	host: 'localhost',
	user: '',
	password: '',
	database: 'toggleappdb'
};


module.exports = {
	getPool: function() {
		if (pool) return pool; // if it is already there, grab it here
		pool = new Pool(config);
		return pool;

	},
	rollback: function(client, done) {
		client.query('ROLLBACK', function(err) {
			//if there was a problem rolling back the query
			//something is seriously messed up.  Return the error
			//to the done function to close & remove this client from
			//the pool.  If you leave a client in the pool with an unaborted
			//transaction weird, hard to diagnose problems might happen.
			return done(err);
		});
	}

};