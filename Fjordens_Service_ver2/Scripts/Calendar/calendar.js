
$(function () {
    //Global var
    var currentEmployee = -1;
    var calLoading = true;
    var sourceUrl = "/PostIt/GetPostIts";
    var templateId = 0;

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
            data: {id: id},
            success: function (data) {
                loadEvents();
            }
        });
    }

    function closeForm() {
        $("#eventPopUp").dialog("close");
        $("#eventForm")[0].reset();
    }

    function getTemplateNo() {
        if ($("#saveToTemp").prop("checked")) {
            console.log($("#templatesList2").val());
            return $("#templatesList2").val();
        } else {
            return 0;
        }
    }

    function openEditEventPopup(id, templateNo) {
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
        $("#eventPopUp").dialog({
            height: 550,
            width: 400,
            modal: true,
            title: "Opret begivenhed",
            buttons: {
                "Gem": function () {
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
                        "templateNo": 0,
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
        var colors = ["Blue", "Brown", "BlueViolet", "BurlyWood", "CadetBlue", "Chartreuse"];
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
        $("#calendar").fullCalendar("removeEventSource", source);
        $("#calendar").fullCalendar("removeEvents");
        $("#calendar").fullCalendar("addEventSource", source);
        $("#calendar").fullCalendar("refetchEvents");
    }

    function getDayOfWeek(date) {
        console.log((moment(date).format("ddd")));
        var formatDate = moment(date).format("ddd");
        var startDate = $("#calendar").fullCalendar("getView").start;
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

    $("#addTemp").click(function () {
        var templateData = {
            "templateId": $("#templatesList").val(),
            "start": $("#calendar").fullCalendar("getView").start._d,
            "end": $("#calendar").fullCalendar("getView").end._d
        };

        $.ajax({
            type: "Post",
            url: "/PostIt/CreateTemplate",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(templateData),
            success: function(data){
                loadEvents();
            } 
        });
        
    });

    function changeCheckBox(kindOfClick) {
        if (kindOfClick === "day") {
            $("#checkbox1").show();
            $("#checkbox2").hide();
        } else {
            $("#checkbox1").hide();
            $("#checkbox2").show();
        }
    }

    $("#calendar").fullCalendar({
        header: {
            left: "prev,next, today",
            center: "title",
            right: "month,agendaWeek,agendaTwoWeeks,agendaDay"
        },
        views: {
            agendaTwoWeeks: {
                type: "agenda",
                duration: { weeks: 2 },
                buttonText: "2 Uger"
            },
        },

        lazyFetching: true,
        defaultView: "agendaWeek",
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
                    loadEvents();
                }
            }
    });
    calLoading = false;
    $("#eventDate").datepicker();

    $("#eventStartTime").timepicker({ "timeFormat": "h:i" });

    $("#eventEndTime").timepicker({ "timeFormat": "h:i" });

    $("#employeesList2").change(function () {
        currentEmployee = $(this).val();
        console.log($(this).val());
        loadEvents();
        
    });
    
});