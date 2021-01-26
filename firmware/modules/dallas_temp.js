// Use this to work with DS18B20 temperature sensors
const Actor = require('actor');
const DS18B20 = require('DS18B20');

class DallasTemp extends Actor {
    constructor(conf, id, bus) {
        try {
            super(conf);
            this.id = id;
            this.dev = DS18B20.connect(bus, id);
            //this.interval = null;
            this.get();
        // console.log("new DALLAS", id, this.name, conf.name, typeof conf)
        } catch (e) {
            console.log("Exception in dallastemp constructor", e);
            throw e;
        }
    }
    get() {
        // this.log("get temperature");
        this.dev.getTemp( (t) => {
            this.set(t);
        })
    }
}


module.exports = DallasTemp;

