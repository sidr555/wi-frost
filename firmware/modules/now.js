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

}
