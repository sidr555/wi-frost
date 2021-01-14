function niceTime(sec) {
        if (sec < 45) {
            return  parseInt(sec) + " сек.";
        } else if (sec < 90) {
            return "1 мин.";
        } else if (sec < 150) {
            return "2 мин.";
        } else if (sec < 3600) {
            return parseInt(sec / 60) + " мин."
        } else if (sec < 2 * 86400) {
            return parseInt(sec / 3600) + " час."
        } else {
            return parseInt(sec / 86400) + " дн."
        }
    };

function niceTimeDiff (time) {
    return time > 0 ? niceTime((new Date()).getTime() / 1000 - time) : "-";
}

//export default Helper;


exports.niceTimeDiff = niceTimeDiff;
