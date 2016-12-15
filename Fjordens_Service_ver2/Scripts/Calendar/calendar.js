
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
        slotDuration: "00:30:00",
        timezone: "UTC",
        events: source,
        dayClick: function (date, jsEvent, view) {
            $('#eventDate').val(moment(date).format('DD/MM/YYYY'));
            $('#eventStartTime').val(moment(date).format('HH:mm'));
            openCreateEventPopup(0);
        },
        eventClick: function (calEvent, jsEvent, view) {
            setAndOpenPopupEC(calEvent);
        },
        eventRender: function (event, element) {
            element.attr("title", event.note);
            setColors(event, element);
            
        },
        viewRender: function (view, element) {
            if (!calLoading) {
                    loadEvents();
            }
            console.log(view.name);
            if (view.name == "month" || view.name == "agendaDay") {
                $("#templatesList").hide();
                $("#addTemp").hide();
            } else {
                $("#templatesList").show();
                $("#addTemp").show();
            }
        },
        eventDrop: function (event, delta, revertFunc) {
            if (confirm("Vil du flytte begivenheden?")) {
                dragNDrop(event);
            } else {
                revertFunc();
            }
        }
    });
    calLoading = false;

    $("#eventDate").datepicker();

    $("#eventStartTime").timepicker({ "timeFormat": "h:i" });

    $("#eventEndTime").timepicker({ "timeFormat": "h:i" });

    $employeesList.change(function () {
        currentEmployee = $(this).val();
        loadEvents();
        
    });
    
});