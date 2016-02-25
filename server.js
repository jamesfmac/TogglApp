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

app.use(urlParser);

app.use(express.static('public'));

app.use(jsonParser);

router.use(function (req, res, next) {
    console.log("/" + req.method);
    next();
});


router.get("/", function (req, res) {
    res.sendFile(path + "index.html");
});
router.get("/login", function (req, res) {
    res.sendFile(path + "login.html");
});

router.post("/api/createuser", function (req, res) {
    var email = req.body.email;
    var passwarod = req.body.password
    var callback = function (err) {
        if (err) {
            res.end
        }
        res.redirect('/');
    }


    createUser.newUser(email, passwarod, callback);
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

app.listen(port, function () {
    console.log("Live at Port 3000");
});