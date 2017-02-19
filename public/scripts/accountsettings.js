$( document ).ready(function() {
    getUserProfile();
});

var userobject = {};


var getUserProfile = function(){
 $.ajax({
        type: "get",
        url: "/api/userprofile",
        processData: false,
        contentType: '/json',
        cache: false
    }).done(function(data){
        console.log('user is ' + data);
        $("#nav-user-firstname").text(data.firstName);
        $("#nav-user-fullname").text(data.firstName + ' ' + data.lastName);
        userobject.firstName = data.firstName;
        userobject.lastName = data.lastName;
        userobject.email = data.Email;
        $("#form-user-firstname").val(data.firstName);
        $("#form-user-lastname").val(data.lastName);
        $("#form-user-email").val(data.email);

        //setting this to understand the user profile data being returned
        userobject = data;
        
    });

};