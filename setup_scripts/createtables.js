//import db connection 
var db = require('../config/database.js');
var pool = db.getPool();
var bcrypt = require('bcrypt');

//set the details for the default user, in future may replace with the ability to pass in users

var testUser = {
    email: "test@test.com",
    password: "test",
    firstName: "Test",
    lastName: "User"

};


//has the password and pass the hash into the function
bcrypt.hash(testUser.password, 8, function(err, hash) {

//user to be inserted into the db
    var user = [testUser.email, hash, testUser.firstName, testUser.lastName];

    pool.query('INSERT INTO users VALUES (DEFAULT,$1,$2,$3, $4)', user, function(err, result) {
       
        if (err) {
            return console.error('insert failed', err);
        }
        console.log('user created for' + user);
        console.log(result);
       

    });

});