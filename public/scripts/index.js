var test = function () {
    var formData = {
        "user": "me!"

    };

    if ($('#startdate').val()) {
        formData.startdate = $('#startdate').val();
    }
    if ($('#enddate').val()) {
        formData.endate = $('#enddate').val();
    }

    $.ajax({
        type: "post",
        url: "/api/timelogs",
        processData: false,
        contentType: 'application/json',
        cache:false,
        data: JSON.stringify(formData)
    });
    console.log(formData);

};

var getUserProfile = function(){
 $.ajax({
        type: "get",
        url: "/api/userprofile",
        processData: false,
        contentType: '/json',
        cache: false
    }).done(function(data){
        console.log('user is' + data);
        $("#nav-user-name").text(data.firstname);
        console.log ($("#nav-user-name").val());
    });

};





/*
document.getElementById("btnrequestextract").addEventListener("click", test); 
*/