$(function () {

    function saveEvent(postItHelpModel) {
        $.ajax({
            type: "Post",
            url: "/PostIt/CreatePostIt",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(postItHelpModel),
            success: function (data) {
                loadEvents();
            }
        });
    }

    function updateEvent(postItHelpModel) {
        $.ajax({
            type: "Post",
            url: "/PostIt/UpdatePostIt",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(postItHelpModel),
            success: function (data) {
                loadEvents();
            }
        });
    }

    function deleteEvent(id) {
        $.ajax({
            url: "/PostIt/DelPostIt",
            dataType: "json",
            contentType: "application/json",
            data: { id: id },
            success: function (data) {
                loadEvents();
            }
        });
    }

    function getColor(i) {
        var colors = ["Blue", "Brown", "BlueViolet", "BurlyWood", "CadetBlue", "Chartreuse"];
        return colors[i];
    }

    $("#eventDate").datepicker();

})