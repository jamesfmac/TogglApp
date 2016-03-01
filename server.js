var express = require("express");
var bodyParser = require('body-parser')
var app = express();
var router = express.Router();
var port = process.env.PORT || 3000;
var path = __dirname + '/views/';
var jsonParser = bodyParser.json();
var urlParser = bodyParser.urlencoded({
    extended: true
})
var buildReport = require('./buildtimereport.js');
var createUser = require('./scripts/createuser.js');
var login = require('./scripts/loguserin.js')

app.use(urlParser);

app.use(express.static('public'));

app.use(jsonParser);

router.use(function (req, res, next) {
    console.log(req.method + " " + req.path);
    next();
});

router.get("/", function (req, res) {
    res.sendFile(path + "index.html");
});

router.get("/login", function (req, res) {
    res.sendFile(path + "login.html");
});

router.post("/login", function (req, res) {
    var request = req.body;
    var callback = function (user) {
        if (typeof user.id == "undefined") {
            console.log(user.id);
            res.redirect('/login');
        } else {
            console.log('redirect hit');
            res.redirect('/');
        }
    };
    login.login(request, callback);

});

router.post("/createuser", function (req, res) {
    var request = req.body;
    var passwarod = req.body.password
    var callback = function (err) {
        if (err) {
            res.end;
        }
        res.redirect('/login');
    }
    createUser.newUser(request, callback);
});

router.post("/api/timelogs", function (req, res) {
    var sdate = req.body.startdate;
    var edate = req.body.enddate;
    console.log(sdate + " " + edate)
    var callback = function (output, filename) {
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
app.get('*', function (req, res) {
    res.redirect('/')
});

app.listen(port, function () {
    console.log("Live at Port 3000");
});