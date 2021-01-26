// Use this to work with 1-wire bus
const Actor = require('actor');
const DallasTemp = require('dallas_temp');

class OneWirePort extends Actor {
    constructor(conf, items) {
        try {
            super(conf);

            this.pin = conf.pin;

            console.log("Initialize new 1-wire bus on port " + this.pin);

            const bus = new OneWire(this.pin);

            this.ids = bus.search();

            this.dallasTemps = this.ids.map( (id) => {
                const iConf = items.find( (item) => item.id === id );
                if (iConf && iConf.name) {
                    // it is an Actor
                    return new DallasTemp(iConf, id, bus);
                } else {
                    // is is an unknown device, just check without any noize
                    const dev = new DallasTemp({}, id, bus);
                    dev.logging = false;
                    dev.silent = true;
                    return dev;
                }
            });

            if (conf.time_check) {
                setInterval(() => this.dallasTemps.forEach((item) => {
                    item.get()
                }), conf.time_check * 1000);
            }
        } catch (e) {
            console.log("Exception in 1wire constructor", e);
            throw e;
        }
    }
}

module.exports = OneWirePort;
