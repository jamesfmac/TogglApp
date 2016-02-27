var newUser = function (request, callback) {
    var pg = require('pg');
    var bcrypt = require('bcrypt');
    var conString = 'postgres://localhost:5432/toggleappdb';

    bcrypt.hash(request.password, 8, function (err, hash) {

        var user = [request.email, hash, request.firstname, request.lastname];




        //this initializes a connection pool
        //it will keep idle connections open for a (configurable) 30 seconds
        //and set a limit of 20 (also configurable)
        pg.connect(conString, function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query('INSERT INTO users VALUES (DEFAULT,$1,$2,$3, $4)', user, function (err, result) {
                done();
                if (err) {
                    return console.error('insert failed', err);
                }
                console.log('trying to select');
                callback();

            });

        });
    });
}
module.exports.newUser = newUser