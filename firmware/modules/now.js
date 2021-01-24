// Use this to get now in unixtime format
module.exports = {
    now: () => parseInt((new Date()).getTime()/1000),
    sec: (time) => parseInt((new Date()).getTime()/1000 - time),

    ajustTime: (timeserver, offset, next) => {
        console.log('fetchTime', timeserver, offset);
        E.setTimeZone(offset);

        require('http').get(timeserver, (res) => {
            let cur = new Date(res.headers.Date);
            // let cur = new Date(utc.getTime() + offset*3600000);
            // console.log('fetchTime', cur);

            setTime(cur.getTime()/1000);

            if (next) {
                next(cur);
            }
        });
    },

    getFromHuman: (str) => {
        console.log('getFromHuman', str);
        return ['h', 'm', 's'].reduce((obj, delim) => {
            const arr = str.split(delim);
            console.log(delim, arr)
            if (arr.length > 1) {
                str = arr[1];
                obj[delim] = arr[0];
            } else {
                obj[delim] = 0;
            }
            return obj;
        }, {});
    },

    // Конвертирует дату вида "7h15m20s" в объект Date сегодня
    getTodayFromHuman: (str) => {
        console.log('getTodayFromHuman', str);
        let date = new Date();
        const times = getFromHuman(str);
        date.setHours(times.h);
        date.setMinutes(times.m);
        date.setSeconds(times.s);
        return date;
    }

}
