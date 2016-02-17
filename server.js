var express = require("express");
var bodyParser = require('body-parser')
var app = express();
var router = express.Router();
var path = __dirname + '/views/';
var jsonParser = bodyParser.json();

app.use(express.static('public'));

app.use(jsonParser);

router.use(function (req, res, next) {
    console.log("/" + req.method);
    next();
});


router.get("/", function (req, res) {
    res.sendFile(path + "index.html");
});



router.post("/api/timelogs", function (req, res) {
    var sdate = req.body.startdate
    res.setHeader('Content-disposition', 'attachment');
    res.setHeader('Content-type', 'text/csv');
    res.download('./output/testfile.csv', 'testfile.csv');
    console.log('post hit' + sdate);
});




app.use("/", router);

app.listen(3000, function () {
    console.log("Live at Port 3000");
});