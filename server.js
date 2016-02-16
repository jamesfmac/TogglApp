var express = require("express");
var bodyParser = require('body-parser')
var app = express();
var router = express.Router();
var path = __dirname + '/views/';
var jsonParser = bodyParser.json();

app.use(express.static('public'));
app.use(bodyParser());

router.use(function (req, res, next) {
    console.log("/" + req.method);
    next();
});


router.get("/", function (req, res) {
    res.sendFile(path + "index.html");
});

app.post('/', function (request, response) {
    console.log(request.body.startdate);
    console.log(request.body.enddate);
    response.end;
});

router.post("/api/timelogs", function (req, res) {
    var recieed = req.body
    var string = JSON.parse(recieed);
    var sdate = req.params.user
    var edate = req.params.edate
    res.send('start date is ' + sdate);
    console.log(req.url + recieed + string)
});


app.use("/", router);

app.listen(3000, function () {
    console.log("Live at Port 3000");
});