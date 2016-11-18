var pg = require('pg');
var conString = 'postgres://localhost:5432/toggleappdb';
var email = 'james@james.com';
var id = 123;

//this initializes a connection pool
//it will keep idle connections open for a (configurable) 30 seconds
//and set a limit of 20 (also configurable)
pg.connect(conString, function(err, client, done) {
    if (err) {
        return console.error('error fetching client from pool', err);
    }
    client.query('INSERT INTO users VALUES (DEFAULT,$1)', ['james@james.com'], function(err, result) {
        done();
        if (err) {
            return console.error('insert failed', err);
        }
        console.log('trying to select');
        client.query('select * from users', function(err, result) {
            done();
            if (err) {
                return console.error('select failed', err);
            }
            return console.log(result);
        });

    });

});