// Bacis self-timer

const Timeable = {
    // timeStart: null,
    startTimer: function() {
        this.timeStart = new Date();
    },
    elapsedTime: function() {
        return this.timeStart ? Math.floor((Date.now() - this.timeStart.getTime())/1000) : 0;
    },
    fromHuman: function(str) {
        // console.log('fromHuman', str);
        return ['d', 'h', 'm', 's'].reduce((obj, delim) => {
            const arr = str.split(delim);
            // console.log(delim, arr)
            if (arr.length > 1) {
                str = arr[1];
                obj[delim] = arr[0];
            } else {
                obj[delim] = 0;
            }
            return obj;
        }, {});
    },

    humanToSec: function(str) {
        const arr = this.fromHuman(str);
        //console.log('human2sec', str, arr.s + 60*arr.m + 3600*arr.h + 86400*arr.d);
        if (arr) {
            return arr.s + 60*arr.m + 3600*arr.h + 86400*arr.d;
        }
        return 0;
    }
}

module.exports = Timeable;
