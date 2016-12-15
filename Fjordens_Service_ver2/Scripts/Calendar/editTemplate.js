$(function () {

    currentEmployee = -1;
    var calLoading = true;
    sourceUrl = "/PostIt/GetTemplate";
    templateId = 1;
    $calendar = $("#editCalendar");
    $employeesList = $("#editEmployeesList2");
    $templatesList = $("#editTemplatesList")
    $eventPopUp = $("#editEventPopUp");
    $eventForm = $("#editEventForm");

    source = {
        url: sourceUrl,
        data: {
            id: templateId,
            employeeId: currentEmployee
        }
    };

    function getTemplateNo() {
        console.log($templatesList.val());
        return $templatesList.val();
    }

    $calendar.fullCalendar({
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
            openCreateEventPopup(getTemplateNo());
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
        },
        eventDrop: function (event, delta, revertFunc) {
            if (confirm("Vil du flytte begivenheden?")) {
                dragNDrop(event);
            } else {
                revertFunc();
            }
        }
    });

    $("#eventDate").datepicker();

    $("#eventStartTime").timepicker({ "timeFormat": "H:i" });

    $("#eventEndTime").timepicker({ "timeFormat": "H:i" });

    $employeesList.change(function () {
        currentEmployee = $(this).val();
        loadEvents();
    });

    $templatesList.change(function () {
        templateId = $(this).val();
        loadEvents();
    });
});