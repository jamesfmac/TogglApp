$( document ).ready(function() {
    console.log('navmenu.js loaded');
    populateUserInUi();
 
});


var populateUserInUi = function(){
 $.ajax({
        type: "get",
        url: "/api/currentuser",
        processData: false,
        contentType: '/json',
        cache: false
    }).done(function(data){
        console.log('user is ' + data.firstName);
        $("#nav-user-firstname").text(data.firstName);
        $("#nav-user-fullname").text(data.firstName + ' ' + data.lastName);
        
    });

};


