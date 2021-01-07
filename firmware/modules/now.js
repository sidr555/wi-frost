// Use this to get now in unixtime format
module.exports = {
    Now: () => parseInt((new Date()).getTime()/1000),
    Sec: (time) => parseInt((new Date()).getTime()/1000 - time)
}
