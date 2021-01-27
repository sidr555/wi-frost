// Use this to work with DS18B20 temperature sensors
const Actor = require('actor');
const DS18B20 = require('DS18B20');

class DallasTemp extends Actor {
    constructor(conf, id, bus) {
        try {
            super(conf);
            this.id = id;
            this.dev = DS18B20.connect(bus, id);
            this.logType = "TempSensor";
            this.get();
        } catch (e) {
            console.log("Exception in dallastemp constructor", e);
            throw e;
        }
    }
    get() {
        // this.log("get temperature");
        this.dev.getTemp( (t) => {
            if (t !== null) {
                // this.log("new temperature", [t]);
                this.set(t);
            }
        })
    }
}


module.exports = DallasTemp;

