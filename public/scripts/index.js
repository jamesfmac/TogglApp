var test = function () {
    var formData = {
        "user": "me!"

    };

    if ($('#startdate').val()) {
        formData.startdate = $('#startdate').val()
    }
    if ($('#enddate').val()) {
        formData.endate = $('#enddate').val()
    }

    $.ajax({
        type: "post",
        url: "/api/timelogs",
        processData: false,
        contentType: 'application/json',
        data: JSON.stringify(formData)
    });
    console.log(formData);

};





/*
document.getElementById("btnrequestextract").addEventListener("click", test); 
*/