$( document ).ready(function() {
    getUserProfile();
});


var getUserProfile = function(){
 $.ajax({
        type: "get",
        url: "/api/userprofile",
        processData: false,
        contentType: '/json',
        cache: false
    }).done(function(data){
        console.log('user is ' + data.firstName);
        $("#nav-user-firstname").text(data.firstName);
        $("#nav-user-fullname").text(data.firstName + ' ' + data.lastName);
        
    });

};