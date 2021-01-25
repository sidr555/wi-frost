// Use this to work with DS18B20 temperature sensors
const DS18B20 = require('DS18B20');

class DallasTemp {
    constructor(bus, id, conf) {
        this.id = id;
        this.name = conf.name;
        this.conf = conf;

        this.dev = DS18B20.connect(bus, id);
        this.value = null;
        this.interval = null;

        this.check();
        // console.log("new DALLAS", id, this.name, conf.name, typeof conf)
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
        if (this.conf.time_send) {
            // this.interval = setInterval(routine, this.conf.time_send * 1000)
            this.interval = setInterval(() => {
                this.subs.forEach((handle) => {
                    handle(this.value);
                });
            }, this.conf.time_send * 1000)
        }
    }
}

module.exports = DallasTemp;

