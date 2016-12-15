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
                    alert("Der gik noget galt! Check om alle felter er udfyldt korrekt.")
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
                    alert("Der gik noget galt! Check om alle felter er udfyldt korrekt.")
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

    function dragNDrop(event) {
            var postItHelpModel = {
                id: event.id,
                title: event.title,
                start: event.start.format("YYYY-MM-DD HH:mm"),
                end: event.end.format("YYYY-MM-DD HH:mm"),
                customerId: event.customerId,
                employeeId: event.employeeId,
                note: event.note,
                templateNo: event.templateNo,
                dayOfWeek: getDayOfWeek(event.start)
            };
            updateEvent(postItHelpModel);
    }

    function setColors(event, element) {
        if (event.isAssigned) {
            var color = getColor(event.employeeId)
            element.css("background-color", color);
        } else {
            element.css("background-color", "red");
        }
    }

    function setAndOpenPopupDC(calEvent) {

    }

    function setAndOpenPopupEC(calEvent) {
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
    }

    function getColor(i) {
        
        var colors = ["BlanchedAlmond", "Blue", "BlueViolet",
            "Brown", "BurlyWood", "CadetBlue", "Chartreuse", "Chocolate", "Coral", "CornflowerBlue", "Cornsilk", "Crimson", "Cyan", "DarkBlue", "DarkCyan",
            "DarkGoldenRod", "DarkGray", "DarkGrey", "DarkGreen", "DarkKhaki", "DarkMagenta", "DarkOliveGreen", "Darkorange", "DarkOrchid", "DarkRed",
            "DarkSalmon", "DarkSeaGreen", "DarkSlateBlue", "DarkSlateGray", "DarkSlateGrey", "DarkTurquoise", "DarkViolet", "DeepPink", "DeepSkyBlue",
            "DimGray", "DimGrey", "DodgerBlue", "FireBrick", "FloralWhite", "ForestGreen", "Fuchsia", "Gainsboro", "GhostWhite", "Gold", "GoldenRod",
            "Gray", "Grey", "Green", "GreenYellow", "HoneyDew", "HotPink", "IndianRed", "Indigo", "Ivory", "Khaki", "Lavender", "LavenderBlush",
            "LawnGreen", "LemonChiffon", "LightBlue", "LightCoral", "LightCyan", "LightGoldenRodYellow", "LightGray", "LightGrey", "LightGreen",
            "LightPink", "LightSalmon", "LightSeaGreen", "LightSkyBlue", "LightSlateGray", "LightSlateGrey", "LightSteelBlue", "LightYellow", "Lime",
            "LimeGreen", "Linen", "Magenta", "Maroon", "MediumAquaMarine", "MediumBlue", "MediumOrchid", "MediumPurple", "MediumSeaGreen", "MediumSlateBlue",
            "MediumSpringGreen", "MediumTurquoise", "MediumVioletRed", "MidnightBlue", "MintCream", "MistyRose", "Moccasin", "NavajoWhite", "Navy", "OldLace",
            "Olive", "OliveDrab", "Orange", "OrangeRed", "Orchid", "PaleGoldenRod", "PaleGreen", "PaleTurquoise", "PaleVioletRed", "PapayaWhip", "PeachPuff",
            "Peru", "Pink", "Plum", "PowderBlue", "Purple", "RosyBrown", "RoyalBlue", "SaddleBrown", "Salmon", "SandyBrown", "SeaGreen", "SeaShell",
            "Sienna", "Silver", "SkyBlue", "SlateBlue", "SlateGray", "SlateGrey", "Snow", "SpringGreen", "SteelBlue", "Tan", "Teal", "Thistle", "Tomato",
            "Turquoise", "Violet", "Wheat", "White", "WhiteSmoke", "Yellow", "YellowGreen"];
        if (i >= colors.length) {
            return colors[0];
        } else {
            return colors[i];
        }
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

                    };
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

    
