// Use this to work with 1-wire bus
const DevPort = require('dev');
const DallasTemp = require('dallas_temp');

class OneWirePort extends DevPort {
    constructor(conf, items) {
        super(conf);

        console.log("Initialize new 1-wire bus on port " + this.pin);

        const bus = new OneWire(conf.pin);

        const subs = {}; // listeners for local jobs

        this.ids = bus.search();
        this.dallasTemps = this.ids.map( (id) => {
            const itemParams = items.find( (item) => item.id === id );
            if (itemParams.name) {
                subs[name] = [];
            }
            return new DallasTemp( bus, id, itemParams || {} );
        });

        if (conf.time_check) {
            setInterval(() => this.dallasTemps.forEach((item) => {
                item.check()
            }), conf.time_check * 1000);
        }
    }
}

module.exports = OneWirePort;
