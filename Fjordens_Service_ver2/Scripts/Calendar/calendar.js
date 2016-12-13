
$(function () {
    //Global var
    currentEmployee = -1;
    var calLoading = true;
    sourceUrl = "/PostIt/GetPostIts";
    templateId = 0;
    $calendar = $("#calendar");
    $employeesList = $("#employeesList2");
    $eventPopUp = $("#eventPopUp");
    $eventForm = $("#eventForm");

    source = {
        url: sourceUrl,
        data: {
            id: templateId,
            employeeId: currentEmployee
        }
    };

    function getTemplateNo() {
        if ($("#saveToTemp").prop("checked")) {
            console.log($("#templatesList2").val());
            return $("#templatesList2").val();
        } else {
            return 0;
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

    $calendar.fullCalendar({
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
            openCreateEventPopup(0);
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

    $employeesList.change(function () {
        currentEmployee = $(this).val();
        console.log($(this).val());
        loadEvents();
        
    });
    
});