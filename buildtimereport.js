var request = require("request");
var util = require("util");
var csv = require("csv");
var fs = require("fs");
var moment = require('moment-timezone');
var sDateIso = "";
var eDateIso = "";
var parsedResponse = ""; //container for returned data
var outputRecords = [];


//testing out moments 


var convertToGmtISO = function (dateTime, dayRounding) {
    var inputDateTime = dateTime;
    var outputDateTime = '';

    if (dayRounding == 'up') {
        outputDateTime = moment.tz(inputDateTime, 'Australia/Sydney').endOf('day').tz('Etc/Greenwich').format();
    } else if (dayRounding == 'down') {

        outputDateTime = moment.tz(inputDateTime, 'Australia/Sydney').startOf('day').tz('Etc/Greenwich').format();
    } else {
        outputDateTime = moment.tz(inputDateTime, 'Australia/Sydney').tz('Etc/Greenwich').format();
    }
    return outputDateTime;
};

//capture missing dates and replace with sdate = 1/1/16 and edate = today
var buildFile = function (sDate, eDate, callback) {
    var filePath = './output/';
    var filename = 'timelog' + sDate + '.csv';
    if (eDate) {
        eDateIso = convertToGmtISO(eDate, 'up');
    } else {
        eDateIso = new Date().toISOString();
    }

    if (sDate) {
        sDateIso = convertToGmtISO(sDate, 'down');
    } else {
        sDateIso = new Date('2016/01/01').toISOString();
    }

    //send request for time entries 
    request({
        url: 'http://www.toggl.com/api/v8/time_entries', //URL to hit
        qs: {
            start_date: sDateIso,
            end_date: eDateIso
        }, //Query string data
        method: 'GET', //Specify the method
        header: {
            'Content-Type': 'application/json'
        },
        auth: {
            'user': 'd7bc0e45194751ccd412cf5a5e02576d',
            'pass': 'api_token'
        }
    }, function (error, response, body) {
        if (error) {
            console.log(error);
        } else {
            parsedResponse = JSON.parse(body);


            createCSVFile(filePath, filename, callback);


        }
    });
};



//function checks what timezone offset to apply (sydney only) and then converts whatever datestamp has been sent
function convertToSydTimezone(inputDate) {
    var timeLogYear = new Date(inputDate).getFullYear();
    var timeZoneOffset = '';
    var daylightSavingsEndDate = new Date('03/01/' + timeLogYear)
    var daylightSavingsStartDate = new Date('10/02/' + timeLogYear)

    if (new Date(inputDate) >= daylightSavingsEndDate && new Date(inputDate) <= daylightSavingsStartDate) {
        timeZoneOffset = 10
    } else {
        timeZoneOffset = 11
    }

    var sydDate = new Date(inputDate).setHours(new Date(inputDate).getHours() + timeZoneOffset)
    return sydDate
}

var createCSVFile = function (filepath, filename, callback) {
    var i = 0;

    for (i; i < parsedResponse.length; i++) {

        var logEntry = parsedResponse[i];
        var startTimeSyd = convertToSydTimezone(logEntry.start);
        var endTimeTimeSyd = convertToSydTimezone(logEntry.start);
        var duration = (logEntry.duration / 60).toFixed(0);
        var startTime = new Date(startTimeSyd).getHours() + "." + ('0' + new Date(logEntry.start).getMinutes()).slice(-2);
        var endTime = new Date(endTimeTimeSyd).getHours() + "." + ('0' + new Date(logEntry.stop).getMinutes()).slice(-2);
        var date = new Date(startTimeSyd).getDate()

        var outPutRow = startTime + " - " + endTime + " " + logEntry.description;
        outputRecords.push({
            Datee: date,
            Duration: duration,
            Comment: outPutRow
        });
    }
    csv.stringify(outputRecords, {
        header: true
    }, function (err, output) {
        if (err) {
            return console.log(err);
        }
        fs.writeFile(filepath + filename, output, function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("The file was saved!");
            callback(filepath, filename);
        });
    });

};
module.exports.buildFile = buildFile


/*  tool to format data nicely to the console
 
 console.log(util.inspect(parsedResponse, {
            depth: 2,
            colors: true
        }));
        
*/