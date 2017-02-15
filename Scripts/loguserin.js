var login = function(request, callback) {
    var pg = require('pg');
    var bcrypt = require('bcrypt');
    var conString = 'postgres://localhost:5432/toggleappdb';
    var user = {};

    //this initializes a connection pool
    //it will keep idle connections open for a (configurable) 30 seconds
    //and set a limit of 20 (also configurable)
    pg.connect(conString, function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('Select * from users where email = $1', [request.email], function(err, result) {
            done();
            if (err) {
                return console.error('insert failed', err);
                
            } else if (result.rows.length > 0) {
                passwordCheck(result);
            } else {
                response(user);
            }

        });

    });


    var passwordCheck = function(result) {
        bcrypt.compare(request.password, result.rows[0].password, function(err, res) {
            if (res) {

                console.log('password check for ' + result.rows[0].first_name + ' is ' + res);
                user.firstName = result.rows[0].first_name;
                user.lastName = result.rows[0].last_name;
                user.id = result.rows[0].id;
                response(user);

            } else {
                response(user);
            }
        });

    };
    var response = function(user) {
        console.log('response called')
        callback(user);
    };

}
module.exports.login = login