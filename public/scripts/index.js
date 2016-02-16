var test = function () {
    var inputstartdate =
        $('#startdate').val();
    var inputenddate =
        $('#endate').val();
    var data = {
        "user": "me!"

    };
    /*
                  $.ajax({
                      type: "POST",
                      url: "/api/timelogs",
                      processData: false,
                      contentType: 'application/json',
                      data: JSON.stringify(data)
                  });
                  console.log(data);
                  */
};






document.getElementById("btnrequestextract").addEventListener("click", test)