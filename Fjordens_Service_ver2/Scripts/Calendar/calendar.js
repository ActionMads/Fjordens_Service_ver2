function saveEvent(postItHelpModel) {
    $.ajax({
        type: "Post",
        url: "/PostIt/CreatePostIt",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(postItHelpModel)
    });
}

function updateEvent(postItHelpModel) {

}

function deleteEvent(id) {

}

function closeForm() {
    $("#eventPopUp").dialog("close");
    $("#eventForm")[0].reset();
}

function openEditEventPopup() {
    $("#eventPopUp").dialog({
        height: 500,
        width: 400,
        modal: true,
        title: "Opdater begivenhed",
        buttons: {
            "Delete": function(){
                $(this).dialog("close");
            },
            "Gem": function () {
                var postItHelpModel = {
                    "title": $("#eventTitle").val(),
                    "start": $("#eventDate").val() + " " + $("#eventStartTime").val(),
                    "end": $("#eventDate").val() + " " + $("#eventEndTime").val(),
                    "customer": $("#eventCompany").val(),
                    "employee": $("#eventEmployee").val(),
                    "note": $("#eventNote").val()
                }
                updateEvent(postItHelpModel);
                closeForm();
            },
            Cancel: function () {
                closeForm();
                
            }
        }
    });
}

function openCreateEventPopup() {
    $("#eventPopUp").dialog({
        height: 500,
        width: 400,
        modal: true,
        title: "Opret begivenhed",
        buttons: {
            "Gem": function () {
                var postItHelpModel = {
                    "title": $("#eventTitle").val(),
                    "start": moment($("#eventDate").val() +" "+ $("#eventStartTime").val(), "dd/MM/YYYY HH:mm"),
                    "end": moment($("#eventDate").val() +" "+ $("#eventEndTime").val(), "dd/MM/YYYY HH:mm"),
                    "customer": $("#eventCompany").val(),
                    "employee": $("#eventEmployee").val(),
                    "note": $("#eventNote").val()
                }
                console.log(postItHelpModel)
                saveEvent(postItHelpModel);
                closeForm();
            },
            Cancel: function () {
                closeForm();
            }
        }
    });
}

$(function () {
    $("#calendar").fullCalendar({
        header: {
            left: "prev,next, today",
            center: "title",
            right: "month,agendaWeek,agendaDay"
        },
        defaultView: "agendaDay",
        editable: true,
        alldaySlot: false,
        selectable: true,
        slotMinutes: 15,
        events: "/PostIt/GetPostIts/",
        dayClick: function (date, jsEvent, view) {
            $('#eventDate').val(moment(date).format('dd/MM/YYYY'));
            $('#eventStartTime').val(moment(date).format('HH:mm'));
            openCreateEventPopup();
            console.log("day clicked!");
        },
        eventClick: function (calEvent, jsEvent, view) {
            $("#eventTitle").val(calEvent.title);
            $('#eventDate').val(moment(calEvent.start).format('dd/MM/YYYY'));
            $('#eventStartTime').val(moment(calEvent.start).format('HH:mm'));
            $("#eventEndTime").val(moment(calEvent.end).format("HH:mm"));
            openEditEventPopup();
            console.log("event clicked!");
        },
        eventRender: function (event, element) {
            element.attr("title", event.note);
        }
    });
});

