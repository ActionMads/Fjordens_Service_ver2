
$(function () {
    var currentEmployee = -1;
    var calLoading = true;
    var source = {
        url: "/PostIt/GetPostIts",
        data: {
            id: 0,
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

    function deleteEvent(id, templateId) {
        $.ajax({
            url: "/PostIt/DelPostIt",
            dataType: "json",
            contentType: "application/json",
            data: {
                id: id,
                templateId: templateId
            },
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

    function openEditEventPopup(id, templateId) {
        $("#eventPopUp").dialog({
            height: 550,
            width: 400,
            modal: true,
            title: "Opdater begivenhed",
            buttons: {
                "Delete": function () {
                    console.log(id);
                    console.log(templateId)
                    deleteEvent(id, templateId);
                    closeForm();
                },
                "Gem": function () {
                    var start = moment($("#eventDate").val() + " " + $("#eventStartTime").val(), "DD/MM/YYYY HH:mm")
                    console.log(start);
                    console.log(moment($("#eventDate").val() + " " + $("#eventEndTime").val(), "DD/MM/YYYY HH:mm"))
                    var postItHelpModel = {
                        "id": id,
                        "title": $("#eventTitle").val(),
                        "start": start,
                        "end": moment($("#eventDate").val() + " " + $("#eventEndTime").val(), "DD/MM/YYYY HH:mm"),
                        "customerId": $("#customersList").val(),
                        "employeeId": $("#employeesList").val(),
                        "note": $("#eventNote").val(),
                        "templateNo": 0,
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

    function openCreateEventPopup(dayOfWeek) {
        $("#eventPopUp").dialog({
            height: 550,
            width: 400,
            modal: true,
            title: "Opret begivenhed",
            buttons: {
                "Gem": function () {
                    var templateNo = getTemplateNo();
                    var start = moment($("#eventDate").val() + " " + $("#eventStartTime").val(), "DD/MM/YYYY HH:mm Z");
                    var end = moment($("#eventDate").val() + " " + $("#eventEndTime").val(), "DD/MM/YYYY HH:mm Z");
                    var postItHelpModel = {
                        "title": $("#eventTitle").val(),
                        "start": start,
                        "end": end,
                        "dayOfWeek": dayOfWeek,
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

    function loadEvents() {
        source = {
            url: "/PostIt/GetPostIts",
            data: {
                id: 0,
                employeeId: currentEmployee
            }
        }
        $("#calendar").fullCalendar("removeEventSource", source);
        $("#calendar").fullCalendar("removeEvents");
        $("#calendar").fullCalendar("addEventSource", source);
        $("#calendar").fullCalendar("refetchEvents");
    }

    function getDayOfWeek(date) {
        console.log(moment(date).format("ddd"));
        if (moment(date).format("ddd") === "man") {
            return 0;
        } else if (moment(date).format("ddd") === "tir") {
            return 1;
        } else if (moment(date).format("ddd") === "ons") {
            return 2;
        } else if (moment(date).format("ddd") === "tor") {
            return 3;
        } else if (moment(date).format("ddd") === "fre") {
            return 4;
        } else if (moment(date).format("ddd") === "lør") {
            return 5;
        } else if (moment(date).format("ddd") === "søn") {
            return 6;
        } else {
            console.log("error");
        }
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
            }
        },
        defaultView: "agendaWeek",
        editable: true,
        alldaySlot: false,
        selectable: true,
        slotMinutes: 15,
        events: source,
        dayClick: function (date, jsEvent, view) {
            $('#eventDate').val(moment(date).format('DD/MM/YYYY'));
            $('#eventStartTime').val(moment(date).format('HH:mm'));
            var dayOfWeek = getDayOfWeek(date);
            changeCheckBox("day");
            openCreateEventPopup(dayOfWeek);
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
            changeCheckBox("event");
            openEditEventPopup(calEvent.id, calEvent.templateId);
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

    $("#employeesList2").change(function () {
        currentEmployee = $(this).val();
        console.log($(this).val());
        loadEvents();
        
    });
});

