// Use this to work with DS18B20 temperature sensors
const DS18B20 = require('DS18B20');

class DallasTemp {
    constructor(bus, id, params) {
        this.id = id;
        this.name = params.name;
        this.params = params;

        this.dev = DS18B20.connect(bus, id);
        this.value = null;
        this.interval = null;

        this.check();
        // console.log("new DALLAS", id, this.name, params.name, typeof params)
    }
    check() {
        this.dev.getTemp( (t) => {
            this.value = t;
        })
    }

    sendLoop(routine) {
        if (this.interval) {
            clearInterval(this.interval)
        }
        if (this.params.time_send) {
            this.interval = setInterval(routine, this.params.time_send * 1000)
        }
    }
}

module.exports = DallasTemp;

