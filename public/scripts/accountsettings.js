$(document).ready(function() {
    $("#success-alert").hide();
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
var watchForDirtyForm = function() {
    $('form')
        .each(function() {
            $(this).data('serialized', $(this).serialize());
        })
        .on('change input', function() {
            $(this)
                .find('input:submit, button:submit')
                .prop('disabled', $(this).serialize() == $(this).data('serialized'));
        })
        .find('input:submit, button:submit')
        .prop('disabled', true);
};



// slide in and out success message
var slideAlert = function() {
    $("#success-alert").addClass("in");
    $("#success-alert").fadeTo(2000, 1200).slideUp(500, function() {
        $("#success-alert").removeClass('in');
    });

};

var scrolltotop = function() {

    $('html, body').animate({ //animates a scroll to top
        scrollTop: 0
    }, 'fast');
    document.activeElement.blur(); // removes focus from the form input field


};



$("#btnupdateuserdetails").click(function() {

    var url = "/api/currentuser"; // the script where you handle the form input.

    $.ajax({
        type: "POST",
        url: url,
        data: $("#form-update-user-details").serialize(), // serializes the form's elements.
        success: function(data) {
            slideAlert(); // show users success message
            scrolltotop();
            watchForDirtyForm(); //resets the form to watch for new changes
        }

    });

    return false; // avoid to execute the actual submit of the form.
});