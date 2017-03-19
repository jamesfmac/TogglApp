var userEmail = 'james.mcmanamey@terem.com.au';


//function to wait on something to complete

var checkJquery = function() {
	if (window.jQuery) {
		// jQuery is loaded  
		alert("jquery loaded!");
	} else {
		// jQuery is not loaded
		alert("jquery Doesn't Work");
	}
};

var inputEmail = function() {
	$("#username").val('james.mcmanamey@terem.com.au');
	$("#login-submit").click();
};

var checkPasswordInputAvailable = function() {
	// Check in the page if a specific element is now visible
	return page.evaluate(function() {
		return $("#login-submit").hasClass("loaded");
	});

};

var inputPassword = function() {
	console.log("The password input is now visible");
	page.evaluate(function() {
		$("#password").val('****'); //password blanked for commit
		$("#login-submit").click();
	});

	page.render('thirdscreen.png');



};

var checkJiraLoaded = function() {


	return page.evaluate(function() {

		var element = document.getElementById('timesheet-mlink');
		console.log('testing for element' + element);
		if (typeof(element) !== 'undefined' && element !== null) {
			return true;
		} else {
			return false;
		}


	});


};

var openTimesheets = function() {
	console.log("Opening timesheet page");
	page.evaluate(function() {
		document.getElementById('timesheet-mlink').click();
	});
	page.render('fourthscreen.png');
	phantom.exit();
};

var page = require('webpage').create();
page.open('https://teremtechnologies.atlassian.net/login', function() {
	page.onConsoleMessage = function(msg) {
		console.log(msg);
	};
	page.render('firstscreen.png');
	console.log('first screenshot taken');
	page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js", function() {
		//input email and submit
		page.evaluate(inputEmail);

		page.render('secondscreen.png');
		console.log('second screenshot taken');

		waitFor(checkPasswordInputAvailable,
			inputPassword
		);

	});
	waitFor(checkJiraLoaded, openTimesheets, 55000);
});



//wait for an function to be complete
function waitFor(testFx, onReady, timeOutMillis) {
	var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 8000, //< Default Max Timout is 3s
		start = new Date().getTime(),
		condition = false,
		interval = setInterval(function() {
			if ((new Date().getTime() - start < maxtimeOutMillis) && !condition) {
				// If not time-out yet and condition not yet fulfilled
				condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
			} else {
				if (!condition) {
					// If condition still not fulfilled (timeout but condition is 'false')
					console.log("'waitFor()' timeout");
					page.render('timeoutimage.png');
					phantom.exit(1);
				} else {
					// Condition fulfilled (timeout and/or condition is 'true')
					console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
					typeof(onReady) === "string" ? eval(onReady): onReady(); //< Do what it's supposed to do once the condition is fulfilled
					clearInterval(interval); //< Stop this interval
				}
			}
		}, 250); //< repeat check every 250ms
}



/*
var page = require('webpage').create();
page.open('https://teremtechnologies.atlassian.net/login', function() {
	page.render('firstscreen.png');
	page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js", function() {
		page.evaluate(function() {
			$("#username").val('james.mcmanamey@terem.com.au');
			$("#login-submit").click();

		});
		page.render('secondscreen.png');

		waitFor(function() {
			return page.evaluate(function() {
				return $('#password').is(":visible");
			});

		}, function() {
			page.evaluate(function() {
				$("#password").val('fraser2320');
				$("#login-submit").click();
			});
			page.render('thirdscreen.png');
		});

		phantom.exit();
	});
});

*/