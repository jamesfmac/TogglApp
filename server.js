var express = require("express");
var bodyParser = require('body-parser');
var app = express();
var router = express.Router();
var port = process.env.PORT || 3000;
var path = __dirname + '/views/';
var jsonParser = bodyParser.json();
var urlParser = bodyParser.urlencoded({
    extended: true
});

var morgan = require('morgan');
var knex = require('knex')({
    client: 'pg',
    connection: {
        host: 'localhost',
        user: '',
        password: '',
        database: 'toggleappdb'
    }
});
var bookshelf = require('bookshelf')(knex);
var passport = require('passport');
var Strategy = require('passport-local').Strategy;

/*var Users = bookshelf.Model.extend({
    tableName: 'users'
});
*/

var db = require('./config/database.js');
var pool = db.getPool();
var Users = require('./Models/users.js');

//testing pg config




var buildReport = require('./buildtimereport.js');
var createUser = require('./scripts/createuser.js');
var login = require('./scripts/loguserin.js');

app.use(morgan('dev'));
app.use(urlParser);
app.use(express.static('public'));
app.use(jsonParser);
app.use(passport.initialize());




router.get('/users/:id', function(req, res) {
    var userID = req.params.id;
    new Users({
        'id': userID

    }).fetch().then(function(collection) {
        res.send(collection.toJSON());
    });
});

router.get('/users', function(req, res) {
    Users.collection().fetch().then(function(collection) {
        res.send(collection.toJSON());
    });

});



router.get("/", function(req, res) {
    res.sendFile(path + "index.html");
});

router.get("/login", function(req, res) {
    res.sendFile(path + "login.html");
});

//testing out passport.js for authorization stratetgy 

router.get("/passportlogin", function(req, res){
    res.sendFile(path+"passportlogin.html");  
});

router.post("/passportlogin", function(req,res){
    var request = req.body;
    var user = Users.findOne(request.email);
    console.log(user);
});



router.post("/login", function(req, res) {
    var request = req.body;
    var callback = function(user) {
        if (typeof user.id == "undefined") {
            console.log(user.id);
            res.redirect('/login');
        } else {
            console.log('redirect hit');
            console.log(user);
            res.redirect('/');
        }
    };
    login.login(request, callback);

});

router.post("/createuser", function(req, res) {
    var request = req.body;
    var passwarod = req.body.password; //not sure if this is needed?
    var callback = function(err) {
        if (err) {
            res.end;
        }
        res.redirect('/login');
    };
    createUser.newUser(request, callback);
});

router.post("/api/timelogs", function(req, res) {
    var sdate = req.body.startdate;
    var edate = req.body.enddate;
    console.log(sdate + " " + edate);
    var callback = function(output, filename) {
        res.setHeader('Content-disposition', 'attachment; filename=' + filename);
        res.setHeader('Content-type', 'text/csv');
        res.end(output, 'utf-8');
        console.log('callback worked??');
    };
    buildReport.buildFile(sdate, edate, callback);

    console.log('post hit' + sdate + buildReport.x);
});

app.use("/", router);
//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res) {
    res.redirect('/');
});

app.listen(port, function() {
    console.log("Live at Port 3000");
    console.log(process.env.NODE_ENV);
});