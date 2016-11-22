
var Pool = require('pg').Pool;
var pool;
var config = {
    host: 'localhost',
    user: '',
    password: '',
    database: 'toggleappdb'
};


module.exports = {
    getPool: function () {
      if (pool) return pool; // if it is already there, grab it here
      pool = new Pool(config);
      return pool;
}};


