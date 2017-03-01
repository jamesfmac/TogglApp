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

//required for user authentication, should be moved into config/passportjs
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');


var db = require('./config/database.js');
var pool = db.getPool();
var Users = require('./Models/users.js');



//testing passport config to fix async password checking

passport.use(new Strategy({
        usernameField: 'email'
    },
    function(email, password, cb) {
        console.log('about to call user lookup');
        Users.findUserByName(email, function(err, user) {
            console.log(user);
            if (err) {
                return cb(err);
            }
            if (!user) {
                return cb(null, false);
            }
            else {
                Users.checkPassword(user.id, password, cb) ;
            }
           
        });
    }
));



passport.serializeUser(function(user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
    Users.findUserById(id, function(err, user) {
        if (err) {
            return cb(err);
        }
        cb(null, user);
    });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}



var buildReport = require('./buildtimereport.js');
var createUser = require('./scripts/createuser.js');
var login = require('./scripts/loguserin.js');

app.use(morgan('dev'));
app.use(urlParser);
app.use(express.static('public'));
app.use(jsonParser);

//middleware used for passport js
app.use(require('cookie-parser')());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));


// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());


//code to restrict all routes except login, taken from stack overflow
/* commenting out for development
app.all('*', function(req,res,next) {
  if (req.path === '/' || req.path === '/login')
    next();
  else
    ensureAuthenticated(req,res,next);  
});
*/

//Routes initialization for the API routes

var api = require('./routes/api');

router.use("/api", api);


//The view routes will eventually be pulled into a view route folder
router.get("/login", function(req, res) {
    res.sendFile(path + "login.html");
});

router.get("/accountsettings", function(req, res) {
    res.sendFile(path + "accountsettings.html");
});

router.get("/",
    function(req, res) {
        res.sendFile(path + "index.html");
    });

router.get("/admin",
    function(req, res) {
        res.sendFile(path + "admin.html");
    });



router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
});

router.post("/createuser", function(req, res) {
    var request = req.body;
    var password = req.body.password; //not sure if this is needed?
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
    if (process.env.NODE_ENV == 'development') {
        console.log('dev' + Users.mock);
    } else {
        console.log('not dev');
    }
});