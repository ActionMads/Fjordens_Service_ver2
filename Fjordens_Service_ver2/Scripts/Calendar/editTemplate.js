$(function () {

    currentEmployee = -1;
    var calLoading = true;
    sourceUrl = "/PostIt/GetTemplate";
    templateId = 1;
    $calendar = $("#editCalendar");
    $employeesList = $("#editEmployeesList2");
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
        console.log($("#editTemplatesList").val());
        return $("#editTemplatesList").val();
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

    $("#eventStartTime").timepicker({ "timeFormat": "H:i" });

    $("#eventEndTime").timepicker({ "timeFormat": "H:i" });

    $employeesList.change(function () {
        currentEmployee = $(this).val();
        console.log($(this).val());
        loadEvents();
    });

    $("#editTemplatesList").change(function () {
        templateId = $(this).val();
        loadEvents();
    });
});