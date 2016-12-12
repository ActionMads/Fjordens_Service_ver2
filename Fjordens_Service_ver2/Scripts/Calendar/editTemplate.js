$(function () {

    var currentEmployee = -1;
    var calLoading = true;
    var sourceUrl = "/PostIt/GetTemplate";
    var templateId = 1;

    var source = {
        url: sourceUrl,
        data: {
            id: templateId,
            employeeId: currentEmployee
        }
    };

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
            data: {
                id: id
            },
            success: function (data) {
                loadEvents();
            }
        });
    }

    function closeForm() {
        $("#editEventPopUp").dialog("close");
        $("#editEventForm")[0].reset();
    }

    function getTemplateNo() {
        console.log($("#editTemplatesList").val());
        return $("#editTemplatesList").val();
    }

    function openEditEventPopup(id, templateNo) {
        $("#editEventPopUp").dialog({
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
                    var start = moment($("#eventDate").val() + " " + $("#eventStartTime").val(), "DD/MM/YYYY HH:mm")
                    var end = moment($("#eventDate").val() + " " + $("#eventEndTime").val(), "DD/MM/YYYY HH:mm")
                    var postItHelpModel = {
                        "id": id,
                        "title": $("#eventTitle").val(),
                        "start": start.format("YYYY-MM-DD HH:mm"),
                        "end": end.format("YYYY-MM-DD HH:mm"),
                        "customerId": $("#customersList").val(),
                        "employeeId": $("#employeesList").val(),
                        "note": $("#eventNote").val(),
                        "templateNo": templateNo,
                        "dayOfWeek": getDayOfWeek(start)

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
        $("#editEventPopUp").dialog({
            height: 550,
            width: 400,
            modal: true,
            title: "Opret begivenhed",
            buttons: {
                "Gem": function () {
                    var templateNo = getTemplateNo();
                    var start = moment($("#eventDate").val() + " " + $("#eventStartTime").val(), "DD/MM/YYYY HH:mm");
                    var end = moment($("#eventDate").val() + " " + $("#eventEndTime").val(), "DD/MM/YYYY HH:mm");
                    var postItHelpModel = {
                        "title": $("#eventTitle").val(),
                        "start": start.format("YYYY-MM-DD HH:mm"),
                        "end": end.format("YYYY-MM-DD HH:mm"),
                        "dayOfWeek": getDayOfWeek(start),
                        "customerId": $("#customersList").val(),
                        "employeeId": $("#employeesList").val(),
                        "note": $("#eventNote").val(),
                        "templateNo": templateNo,
                    }

                    console.log(postItHelpModel);
                    saveEvent(postItHelpModel);
                    closeForm();
                },
                Cancel: function () {
                    closeForm();
                }
            }
        });
    }

    function getColor(i) {
        var colors = [
            "Blue", "Brown", "BlueViolet", "BurlyWood", "CadetBlue", "Chartreuse", "Chocolate", "Coral", "CornflowerBlue", "Cornsilk", "Crimson",
            "Cyan", "DarkBlue", "DarkGoldenRod", "DarkGray", "DarkGrey", "DarkGreen", "DarkKhaki", "DarkMagneta", "DarkOliveGreen", "DarkOrange",

            ];
        return colors[i];
    }

    function loadEvents() {
        source = {
            url: sourceUrl,
            data: {
                id: templateId,
                employeeId: currentEmployee
            }
        }
        $("#editCalendar").fullCalendar("removeEventSource", source);
        $("#editCalendar").fullCalendar("removeEvents");
        $("#editCalendar").fullCalendar("addEventSource", source);
        $("#editCalendar").fullCalendar("refetchEvents");
    }

    function getDayOfWeek(date) {
        console.log((moment(date).format("ddd")));
        var formatDate = moment(date).format("ddd");
        var startDate = $("#editCalendar").fullCalendar("getView").start;
        var dayOfWeek = 0
        console.log(startDate.isoWeek())
        if (formatDate === "man") {
            dayOfWeek = 0;
        } else if (formatDate === "tir") {
            dayOfWeek = 1;
        } else if (formatDate === "ons") {
            dayOfWeek = 2;
        } else if (formatDate === "tor") {
            dayOfWeek = 3;
        } else if (formatDate === "fre") {
            dayOfWeek = 4;
        } else if (formatDate === "lør") {
            dayOfWeek = 5;
        } else if (formatDate === "søn") {
            dayOfWeek = 6;
        } else {
            console.log("dayOfWeek error");
            dayOfWeek = 0;
        }
        if (moment(date).isoWeek() > startDate.isoWeek()) {
            dayOfWeek += 8;
            console.log(dayOfWeek);
        }
        if (moment(date).isoWeek() == 1 && startDate.isoWeek() > 1) {
            dayOfWeek += 8;
            console.log(dayOfWeek);
        }
        return dayOfWeek;
    }

    $("#editCalendar").fullCalendar({
        header: {
            left: "",
            center: "",
            right: "editTemplate"
        },
        views: {
            editTemplate: {
                type: "agenda",
                duration: { weeks: 2 },
                buttonText: "Rediger templates"
            }
        },

        lazyFetching: true,
        defaultView: "editTemplate",
        editable: true,
        allDaySlot: false,
        selectable: true,
        slotMinutes: 15,
        timezone: "UTC",
        events: source,
        dayClick: function (date, jsEvent, view) {
            $('#eventDate').val(moment(date).format('DD/MM/YYYY'));
            $('#eventStartTime').val(moment(date).format('HH:mm'));
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
            openEditEventPopup(calEvent.id, calEvent.templateNo);
            console.log("event clicked!");
        },
        eventRender: function (event, element) {
            element.attr("title", event.note);
            if (event.isAssigned) {
                var color = getColor(event.employeeId)
                element.css("background-color", color);
            } else {
                element.css("background-color", "red");
            }
        },
        viewRender: function (view, element) {
            if (!calLoading) {
                if (view.name === "editTemplate") {
                    console.log(view.name);
                    sourceUrl = "/PostIt/GetTemplate";
                    templateId = templateId;
                    loadEvents();
                }
            }

        }
    });

    $("#eventDate").datepicker();

    $("#eventStartTime").timepicker({ "timeFormat": "h:i" });

    $("#eventEndTime").timepicker({ "timeFormat": "h:i" });

    $("#editEmployeesList2").change(function () {
        currentEmployee = $(this).val();
        console.log($(this).val());
        loadEvents();
        
    });

    $("#editTemplatesList").change(function () {
        templateId = $(this).val();
        loadEvents();
    });
});