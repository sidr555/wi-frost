// Use this to work with DS18B20 temperature sensors
const DS18B20 = require('DS18B20');

class DallasTemp {
    constructor(bus, id, params) {
        this.id = id;
        this.name = params.name;
        this.dev = DS18B20.connect(bus, id);
        this.temperature = null;
        this.check();
    }
    check() {
        this.dev.getTemp( (t) => {
            this.temperature = t;
        })
    }
}

module.exports = DallasTemp;
