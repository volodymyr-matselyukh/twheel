"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUtcDateTimeString = void 0;
var getUtcDateTimeString = function (date) {
    var month = date.getUTCMonth();
    var day = date.getUTCDay();
    var hours = date.getUTCHours();
    var hoursString = hours.toString();
    if (hours < 10) {
        hoursString = "0" + hoursString;
    }
    var minutes = date.getUTCMinutes();
    var minutesString = minutes.toString();
    if (minutes < 10) {
        minutesString = "0" + minutesString;
    }
    var seconds = date.getUTCSeconds();
    var secondsString = seconds.toString();
    if (seconds < 10) {
        secondsString = "0" + secondsString;
    }
    return "".concat(day, " ").concat(getMonthString(month), " ").concat(hoursString, ":").concat(minutesString, ":").concat(secondsString);
};
exports.getUtcDateTimeString = getUtcDateTimeString;
var getMonthString = function (index) {
    switch (index) {
        case 0:
            return "Jan";
        case 1:
            return "Feb";
        case 2:
            return "Mar";
        case 3:
            return "Apr";
        case 4:
            return "May";
        case 5:
            return "Jun";
        case 6:
            return "Jul";
        case 7:
            return "Aug";
        case 8:
            return "Sep";
        case 9:
            return "Oct";
        case 10:
            return "Nov";
        case 11:
            return "Dec";
    }
    throw new Error("Unknown index");
};
