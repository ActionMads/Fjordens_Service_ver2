var currentEmployee = -1;
var sourceUrl = "";
var templateId = 0;
var $calendar = null;
var $employeesList = null;
var source = null;
var $eventPopUp = null;
var $eventForm = null;

    function saveEvent(postItHelpModel) {
        $.ajax({
            type: "Post",
            url: "/PostIt/CreatePostIt",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(postItHelpModel),
            success: function (data) {
                if (data) {
                    loadEvents();
                } else {
                    alert("Der gik noget galt! Check om du har udfyldt alle felter korrekt.")
                }
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
                if (data) {
                    loadEvents();
                } else {
                    alert("Der gik noget galt! Check om du har udfyldt alle felter korrekt.")
                }
            }
        });
    }

    function deleteEvent(id) {
        $.ajax({
            url: "/PostIt/DelPostIt",
            dataType: "json",
            contentType: "application/json",
            data: { id: id },
            success: function (data) {
                if (data) {
                    loadEvents();
                } else {
                    alert("Der gik noget galt! Begivendheden blev muligvis ikke slettet korrekt.")
                }
            }
        });
    }

    function closeForm() {
        $eventPopUp.dialog("close");
        $eventForm[0].reset();
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
        $calendar.fullCalendar("removeEventSource", source);
        $calendar.fullCalendar("removeEvents");
        $calendar.fullCalendar("addEventSource", source);
        $calendar.fullCalendar("refetchEvents");
    }

    function getDayOfWeek(date) {
        console.log((moment(date).format("ddd")));
        var formatDate = moment(date).format("ddd");
        var startDate = $calendar.fullCalendar("getView").start;
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

    function openEditEventPopup(id, templateNo) {
        $eventPopUp.dialog({
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

    function openCreateEventPopup(templateNo) {
        $eventPopUp.dialog({
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

    
