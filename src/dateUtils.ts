export const getUtcDateTimeString = (date: Date) => {
    const month = date.getUTCMonth();
    const day = date.getUTCDate();
    const hours = date.getUTCHours();
    let hoursString = hours.toString();
    if(hours < 10)
    {
        hoursString = "0" + hoursString;
    }
    
    const minutes = date.getUTCMinutes();
    let minutesString = minutes.toString();
    if(minutes < 10)
    {
        minutesString = "0" + minutesString;
    }

    const seconds = date.getUTCSeconds();
    let secondsString = seconds.toString();

    if(seconds < 10)
    {
        secondsString = "0" + secondsString;
    }

    return `${day} ${getMonthString(month)} ${hoursString}:${minutesString}:${secondsString}`;
}

const getMonthString = (index: number) => {
    switch(index){
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
}