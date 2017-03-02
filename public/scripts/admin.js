//sample data to stand in for an array of users

$(document).ready(function() {
	$("#success-alert").hide();
	getUserProfile(populatetable);



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
			addListnersToActionButtons();


		}
	}



};

var addListnersToActionButtons = function() {

	//code to toggle rows between editable and not
	$('#btn-edit1').click(function() {
		console.log('btnclicked');
		var clickedButton = $(this);
		var clickedButtonSpan = $('span:first', this);
		console.log(clickedButton);
		var currentTD = $(this).parents('tr').find('td');
		if (clickedButtonSpan.hasClass('glyphicon-pencil')) {
			console.log('button in edit mode');
			currentTD = $(this).parents('tr').find('td');
			$.each(currentTD, function() {
				$(this).prop('contenteditable', true);

			});
			clickedButtonSpan.removeClass('glyphicon-pencil');
			clickedButtonSpan.addClass('glyphicon-floppy-disk');
			clickedButton.addClass('btn-primary');
		} else {
			$.each(currentTD, function() {
				$(this).prop('contenteditable', false);

			});
			clickedButtonSpan.removeClass('glyphicon-floppy-disk');
			clickedButton.removeClass('btn-primary');
			clickedButtonSpan.addClass('glyphicon-pencil');
			

		}

	});
};



var getUserProfile = function(callback) {
	$.ajax({
		type: "get",
		url: "/api/users",
		processData: false,
		contentType: '/json',
		cache: false
	}).done(function(data) {
		console.log('user is ' + data);
		$("#nav-user-firstname").text(data.firstName);
		$("#nav-user-fullname").text(data.firstName + ' ' + data.lastName);
		$("#form-user-firstname").val(data.firstName);
		$("#form-user-lastname").val(data.lastName);
		$("#form-user-email").val(data.email);
		$("#form-user-apikey").val(data.apiKey);

		//setting this to understand that all users are being returned to the frontend
		users = data;
		callback(users);


	});
};