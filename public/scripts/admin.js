//sample data to stand in for an array of users

$(document).ready(function() {
	$("#success-alert").hide();
	getUserProfile(populatetable);


});

var users = [];

var populatetable = function(users) {

	for (var i = 0; i < users.length; i++) {
		$('#table-user-admin > tbody:last').append('<tr><td>' + users[i].id + '</td<td>' + users[i].firstName + '</td><td>' + users[i].lastName + '</td><td>' + users[i].email + '</td><td>' + users[i].apikey + '</td><td><span class="glyphicon glyphicon-trash" aria-hidden="true"></span> <span class="glyphicon glyphicon-pencil" aria-hidden="true"></span> </td>');
	}
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