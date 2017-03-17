//sample data to stand in for an array of users

$(document).ready(function() {
	// ger users and populate table on page load 
	getAllUsers(populatetable);

});



//builds and populates the data table 
var populatetable = function(users) {

	var foundUsers = users.length; //number of users returned from the db
	var rowsAdded = 0;

	for (var i = 0; i < foundUsers; i++) {
		var tableData = '<tr id="row' + i + '"><td id ="user-id' + i + '">' + users[i].id + '</td><td id = "user-firstname' + i + '">' + users[i].firstName + '</td><td id = "user-lastname' + i + '">' + users[i].lastName + '</td><td id = "user-email' + i + '">' + users[i].email + '</td><td id = "user-apikey' + i + '">' + users[i].apikey + '</td>';
		var tableDeletRow = '<td><button class="btn btn-default " type = "button" id ="btn-delete' + i + '"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></button>';
		var tableEditRow = '<button data-editmode = 0 data-rownumber = ' + i + ' class = "btn btn-default editbtn " type = "button" id ="btn-edit' + i + '"> <span class="glyphicon glyphicon-pencil" aria-hidden="true"></span> </button> </td>';
		$('#table-user-admin > tbody:last').append(tableData + tableDeletRow + tableEditRow);
		rowsAdded++;
		if (rowsAdded == foundUsers) {
			console.log(foundUsers + " " + rowsAdded);
		
			addListnersToActionButtons(rowsAdded);
		}
	}
};


//loop through created buttons and add listners
var addListnersToActionButtons = function(rowsintable) {
	listnersAdded = 0;
	for (var i = 0; i < rowsintable; i++) {
		$('#btn-edit' + i).click(editRowAction);
		$('#btn-delete' + i).click(delteRowAction);

	}
};


//function for the edit row button 
var editRowAction = function() {
	var clickedButton = $(this);
	var currentstate = clickedButton.attr('data-editmode');
	var rownumber = clickedButton.attr('data-rownumber');
	var clickedButtonSpan = $('span:first', this);

	if (currentstate == 1) {
		//row is in edit mode already
		console.log('saving!!' + currentstate);
		//save changes to db
		saveChangeToUser(rownumber);

		//reset button to normal mode
		clickedButtonSpan.removeClass('glyphicon-floppy-disk');
		clickedButton.removeClass('btn-primary');
		clickedButtonSpan.addClass('glyphicon-pencil');

		clickedButton.attr('data-editmode', 0);
		revertRowToNormal(rownumber);


	} else {
		console.log('ready to edit!' + currentstate + 'rownumber ' + rownumber);

		makeRowEditable(rownumber);

		//change the button styling
		clickedButtonSpan.removeClass('glyphicon-pencil');
		clickedButtonSpan.addClass('glyphicon-floppy-disk');
		clickedButton.addClass('btn-primary');

		clickedButton.attr('data-editmode', 1);


	}

};



//fundtion for the delete row button 
var delteRowAction = function() {
	console.log('delteRowAction');

};

//test function for switching on inline forms 

var makeRowEditable = function(rowid) {
	tds = [
		'user-firstname' + rowid,
		'user-lastname' + rowid,
		'user-email' + rowid,
		'user-apikey' + rowid
	];
	replaceTdDataWithInputField(tds);
};

//return rows to normal state
var revertRowToNormal = function(rowid) {
	inputs = [
		'input-user-firstname' + rowid,
		'input-user-lastname' + rowid,
		'input-user-email' + rowid,
		'input-user-apikey' + rowid
	];
	replaceInputFieldsWithTds(inputs);
};



//replaces an array of tds with input fields
var replaceTdDataWithInputField = function(tds) {
	//accepts an array of td elements and converts them all to inputs
	for (var i = 0; i < tds.length; i++) {
		//store value from the td
		var valueFromTd = $('#' + tds[i]).text();
		//construct the input element
		var inputField = '<input id = "input-' + tds[i] + '" type="text" name="firstname" class="form-control" value="' + valueFromTd + '">';
		//clear the td
		$('#' + tds[i]).empty();
		//append the new element
		$('#' + tds[i]).prepend(inputField);
	}
};

//reverts input fields to tds 
var replaceInputFieldsWithTds = function(inputs) {

	//accepts an array of td elements and converts them all to inputs
	for (var i = 0; i < inputs.length; i++) {

		//store value from the input
		var valueFrominput = $('#' + inputs[i]).val();
		console.log(valueFrominput);

		//get parent td of input
		var parentTD = $('#' + inputs[i]).parents('td').text(valueFrominput);
		console.log(parentTD);
		//delete input field
		$('#' + inputs[i]).remove();

	}
};




//save changes to the selected user 
var saveChangeToUser = function(rowid) {
	//getting data from the table row
	var data = {
		firstname: $('#input-user-firstname' + rowid).val(),
		lastname: $('#input-user-lastname' + rowid).val(),
		email: $('#input-user-email' + rowid).val(),
		apikey: $('#input-user-apikey' + rowid).val(),
	};
	console.log(data);

	var url = "/api/users" + rowid; // the script where you save user data
	console.log(url);
	$.ajax({
		type: "PUT",
		url: url,
		data: data, // serializes the form's elements.
		success: function(data) {
			rowSavedAlert(rowid); // show users success message


		}

	});

	return false; // avoid to execute the actual submit of the form.

};


// flashes saved row green
var rowSavedAlert = function(rowid) {
	$("#row" + rowid).addClass("success");
	//wait 2 seconds before clearing highlight
	setTimeout(function() {
		$("#row" + rowid).removeClass("success");
	}, 2000);
};



//gets all users in the system
var getAllUsers = function(callback) {
	$.ajax({
		type: "get",
		url: "/api/users",
		processData: false,
		contentType: '/json',
		cache: false
	}).done(function(data) {
		//setting this to understand that all users are being returned to the frontend
		users = data;
		callback(users);


	});
};