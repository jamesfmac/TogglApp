//sample data to stand in for an array of users

$(document).ready(function() {
	$("#success-alert").hide();
	getAllUsers(populatetable);



});

var users = [];

var populatetable = function(users) {

	var foundUsers = users.length;
	var rowsAdded = 0;

	for (var i = 0; i < foundUsers; i++) {
		var tableData = '<tr><td>' + users[i].id + '</td><td>' + users[i].firstName + '</td><td>' + users[i].lastName + '</td><td>' + users[i].email + '</td><td>' + users[i].apikey + '</td>';
		var tableDeletRow = '<td><button class="btn btn-default " type = "button" id ="btn-delete' + users[i].id + '"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></button>';
		var tableEditRow = '<button class = "btn btn-default editbtn " type = "button" id ="btn-edit' + users[i].id + '"> <span class="glyphicon glyphicon-pencil" aria-hidden="true"></span> </button> </td>';
		$('#table-user-admin > tbody:last').append(tableData + tableDeletRow + tableEditRow);
		rowsAdded++;
		if (rowsAdded == foundUsers) {
			console.log(foundUsers + " " + rowsAdded);
			addListnersToActionButtons(rowsAdded);


		}
	}



};

var addListnersToActionButtons = function(rowsAdded) {

	//code to toggle rows between editable and not
	$('#btn-edit1').click(function() {
			console.log('btnclicked');
			var clickedButton = $(this);
			var clickedButtonSpan = $('span:first', this);
			console.log(clickedButton);
			var currentTR = $(this).parents('tr');
			var currentTD = $(this).parents('tr').find('td');
			if (clickedButtonSpan.hasClass('glyphicon-pencil')) {
				console.log('button in edit mode');
				currentTD = $(this).parents('tr').find('td');
				$.each(currentTD, function() {
					currentTR.addClass('info');
					$(this).prop('contenteditable', true);

				});
				clickedButtonSpan.removeClass('glyphicon-pencil');
				clickedButtonSpan.addClass('glyphicon-floppy-disk');
				clickedButton.addClass('btn-primary');
			} else {
				$.each(currentTD, function() {
					currentTR.removeClass('info');
					$(this).prop('contenteditable', false);
					saveChangeToUser(users[1]);

				});
				clickedButtonSpan.removeClass('glyphicon-floppy-disk');
				clickedButton.removeClass('btn-primary');
				clickedButtonSpan.addClass('glyphicon-pencil');


			}

		}

	);

	$('#btn-delete1').click(function() {
			console.log('deleting');
		}

	);


};


//save changes to the selected user 
var saveChangeToUser = function(user) {


	var url = "/api/users/" + user.id; // the script where you handle the form input.
	console.log(url);
	$.ajax({
		type: "PUT",
		url: url,
		data: user, // serializes the form's elements.
		success: function(data) {
			slideAlert(); // show users success message
			scrolltotop();

		}

	});

	return false; // avoid to execute the actual submit of the form.

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
		console.log('users found are ');
		console.log(data);
		//setting this to understand that all users are being returned to the frontend
		users = data;
		callback(users);


	});
};