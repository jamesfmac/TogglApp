
//sample data to stand in for an array of users

var sampledata = [

{firstName: 'blue',
lastName: 'dog',
email: 'woof@bark',
id: 12,
api: 'something' } ,

{firstName: 'green',
lastName: 'cat',
email: 'scratch@meow',
id: 7,
api: 'somethingelse' } 

];



//test function for generating rows 
$("#btn-load-users").click(function() {

populatetable(sampledata);
	
	
});

var populatetable = function (data){

	for (var i = 0; i < data.length; i++) {
		$('#table-user-admin > tbody:last').append('<tr><td>'+data[i].id+'</td<td>' + data[i].firstName + '</td><td>'+ data[i].lastName +'</td><td>'+ data[i].email+'</td><td>' +data[i].api+'</td><td><span class="glyphicon glyphicon-trash" aria-hidden="true"></span> <span class="glyphicon glyphicon-pencil" aria-hidden="true"></span> </td>');
	}
};