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

    console.log('array length is'+ parsedResponse.length);
    if (parsedResponse.length>0){
        parsedResponse.length=0;
    }
    
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


            createCSVFile( filename, callback);


        }
    });
};



//function checks what timezone offset to apply (sydney only) and then converts whatever datestamp has been sent
function convertToSydTimezone(inputDate) {
   

    var sydDate = '';

    if (moment.parseZone(inputDate)._offset === 0) {

        sydDate = moment.tz(inputDate, 'Etc/Greenwich').tz('Australia/Sydney');
    } else {
        sydDate = moment.tz(inputDate);
    }
 
    return sydDate;
}

var createCSVFile = function ( filename, callback) {
    var i = 0;

    console.log('output length is'+ outputRecords.length);
        if (outputRecords.length>0){
            outputRecords.length=0;
        }

    /*
     console.log(util.inspect(parsedResponse, {
            depth: 2,
            colors: true
        }));
     */

    for (i; i < parsedResponse.length; i++) {

        var logEntry = parsedResponse[i];
        var startTimeSyd = convertToSydTimezone(logEntry.start);
        var endTimeSyd = convertToSydTimezone(logEntry.stop);
        var duration = (logEntry.duration / 60).toFixed(0);
        var startTime = startTimeSyd.format('h.mma');
        var endTime = endTimeSyd.format('h.mma');
        var date = startTimeSyd.format('ddd D MMM');
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
        console.log("The file was saved!");
        callback(output, filename);
    });

};
module.exports.buildFile = buildFile;




