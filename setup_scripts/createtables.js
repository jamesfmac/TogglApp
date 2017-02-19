//import db connection 
var db = require('../config/database.js');
var pool = db.getPool();



// drops and recreats users table with a cascading drop 
    pool.query(' DROP TABLE IF EXISTS users CASCADE; CREATE TABLE users(\
        id SERIAL PRIMARY KEY, email VARCHAR(40) UNIQUE not null, password VARCHAR(80) not null,first_name VARCHAR(40), last_name VARCHAR(40))', 
        function(err, result) {   
        if (err) {
            return console.error('insert failed', err);
        }   
        console.log(result);
       
    });

 
// create API key table
      pool.query('CREATE TABLE users_api_keys(\
        user_id integer not null ,api_key VARCHAR(60) not null, PRIMARY KEY (user_id, api_key),CONSTRAINT user_id_fkey FOREIGN KEY (user_id) REFERENCES users (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE CASCADE)', 
        function(err, result) {   
        if (err) {
            return console.error('insert failed', err);
        }   
        console.log(result);
    });
