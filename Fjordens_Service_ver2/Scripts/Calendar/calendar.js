
$(function () {

    var calLoading = true;
    var source = {
        url: "/PostIt/GetPostIts",
        data: {
            id: $("#templatesList").val()
        }
    };


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
            data: { id: id }
        });
    }

    function closeForm() {
        $("#eventPopUp").dialog("close");
        $("#eventForm")[0].reset();
        $("#calendar").fullCalendar("refetchEvents");
    }

    function openEditEventPopup(id) {
        $("#eventPopUp").dialog({
            height: 550,
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
                        "note": $("#eventNote").val(),
                        "templateNo": $("#templatesList2").val()
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
            height: 550,
            width: 400,
            modal: true,
            title: "Opret begivenhed",
            buttons: {
                "Gem": function () {
                    var postItHelpModel = {
                        "title": $("#eventTitle").val(),
                        "start": moment($("#eventDate").val() + " " + $("#eventStartTime").val(), "DD/MM/YYYY HH:mm"),
                        "end": moment($("#eventDate").val() + " " + $("#eventEndTime").val(), "DD/MM/YYYY HH:mm"),
                        "customerId": $("#customersList").val(),
                        "employeeId": $("#employeesList").val(),
                        "note": $("#eventNote").val(),
                        "templateNo": $("#templatesList2").val()
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

    function loadEvents() {
        source = {
            url: "/PostIt/GetPostIts",
            data: {
                id: $("#templatesList").val()
            }
        }
        $("#calendar").fullCalendar("removeEventSource", source);
        $("#calendar").fullCalendar("removeEvents");
        $("#calendar").fullCalendar("addEventSource", source);
        $("#calendar").fullCalendar("refetchEvents");
    }

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
        events: source,
        dayClick: function (date, jsEvent, view) {
            $('#eventDate').val(moment(date).format('DD/MM/YYYY'));
            $('#eventStartTime').val(moment(date).format('HH:mm'));
            $("#templatesList2").val($("#templatesList").val());
            openCreateEventPopup();
            console.log("day clicked!");
        },
        eventClick: function (calEvent, jsEvent, view) {
            $("#eventTitle").val(calEvent.title);
            $('#eventDate').val(moment(calEvent.start).format('DD/MM/YYYY'));
            $('#eventStartTime').val(moment(calEvent.start).format('HH:mm'));
            $("#eventEndTime").val(moment(calEvent.end).format("HH:mm"));
            console.log(calEvent.customerName);
            console.log(calEvent.employeeName);
            $("#customersList").val(calEvent.customerId);
            $("#employeesList").val(calEvent.employeeId);
            $("#eventNote").val(calEvent.note);
            $("#templatesList2").val(calEvent.templateNo);
            openEditEventPopup(calEvent.id);
            console.log("event clicked!");
        },
        eventRender: function (event, element) {
            element.attr("title", event.note);
        },
        viewRender: function (view, element) {
            if (!calLoading) {
                loadEvents();
            }
            calLoading = false;
        }
    });
    $("#eventDate").datepicker();

    $("#templatesList").change(function () {
        console.log("dropdown change");
        loadEvents();
    });
});

