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
    $.ajax({
        type: "Post",
        url: "/PostIt/UpdatePostIt",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(postItHelpModel)
    });
}

function deleteEvent(id) {
    $.ajax({
        url: "/PostIt/DelPostIt",
        dataType: "json",
        contentType: "application/json",
        data: {id: id}
    });
}

function closeForm() {
    $("#eventPopUp").dialog("close");
    $("#eventForm")[0].reset();
}

function openEditEventPopup(id) {
    console.log($("#customersList").val());
    console.log($("#employeesList").val());
    $("#eventPopUp").dialog({
        height: 500,
        width: 400,
        modal: true,
        title: "Opdater begivenhed",
        buttons: {
            "Delete": function () {
                console.log(id);
                deleteEvent(id);
                closeForm();
            },
            "Gem": function () {
                var postItHelpModel = {
                    "id": id,
                    "title": $("#eventTitle").val(),
                    "start": moment($("#eventDate").val() + " " + $("#eventStartTime").val(), "DD/MM/YYYY HH:mm"),
                    "end": moment($("#eventDate").val() + " " + $("#eventEndTime").val(), "DD/MM/YYYY HH:mm"),
                    "customerId": $("#customersList").val(),
                    "employeeId": $("#employeesList").val(),
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
                    "start": moment($("#eventDate").val() +" "+ $("#eventStartTime").val(), "DD/MM/YYYY HH:mm"),
                    "end": moment($("#eventDate").val() +" "+ $("#eventEndTime").val(), "DD/MM/YYYY HH:mm"),
                    "customerId": $("#customersList").val(),
                    "employeeId": $("#employeesList").val(),
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
            $('#eventDate').val(moment(date).format('DD/MM/YYYY'));
            $('#eventStartTime').val(moment(date).format('HH:mm'));
            $("#customersList select").val(0);
            $("#employeesList select").val(0);
            openCreateEventPopup();
            console.log("day clicked!");
        },
        eventClick: function (calEvent, jsEvent, view) {
            $("#eventTitle").val(calEvent.title);
            $('#eventDate').val(moment(calEvent.start).format('DD/MM/YYYY'));
            $('#eventStartTime').val(moment(calEvent.start).format('HH:mm'));
            $("#eventEndTime").val(moment(calEvent.end).format("HH:mm"));
            $("#customersList select").val(calEvent.customerId);
            $("#employeesList select").val(calEvent.employeeId);
            $("#eventNote").val(calEvent.note);
            openEditEventPopup(calEvent.id);
            console.log("event clicked!");
        },
        eventRender: function (event, element) {
            element.attr("title", event.note);
        }
    });
    $("#eventDate").datepicker();
});

