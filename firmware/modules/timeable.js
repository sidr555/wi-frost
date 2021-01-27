// Bacis self-timer

const Timeable = {
    // timeStart: null,
    startTimer: function() {
        this.timeStart = new Date();
    },
    elapsedTime: function() {
        return this.timeStart ? Math.floor((Date.now() - this.timeStart.getTime())/1000) : 0;
    }
}

module.exports = Timeable;
