$(document).ready(function() {
    getUserProfile(watchForDirtyForm);
    

});

var userobject = {};


var getUserProfile = function(callback) {
    $.ajax({
        type: "get",
        url: "/api/currentuser",
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

        //setting this to understand the user profile data being returned
        userobject = data;
        //start the watch for updates to the form
        callback();

    });
};

// serialize form data and on each change check if it stil matches against the original value 
var watchForDirtyForm = function(){
    $('form')
    .each(function(){
        $(this).data('serialized', $(this).serialize());
    })
    .on('change input', function(){
        $(this)             
            .find('input:submit, button:submit')
                .prop('disabled', $(this).serialize() == $(this).data('serialized'))
        ;
     })
    .find('input:submit, button:submit')
        .prop('disabled', true);
};




/* disabling to see if not needed
var enableSubmitBtn = function() {
    $('#btnupdateuserdetails').prop('disabled', false);
};

var disableSubmitBtn = function() {
    $('#btnupdateuserdetails').prop('disabled', true);
};
*/