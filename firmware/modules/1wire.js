// Use this to work with 1-wire bus

const DallasTemp = require('dallas_temp');

class OneWirePort {
    constructor(params, items) {
        this.name = params.name;
        this.pin = params.pin;

        const bus = new OneWire(params.pin);

        this.ids = bus.search();
        this.dallasTemps = this.ids.map( (id) => {
            const itemParams = items.find( (item) => item.id === id );
            return new DallasTemp( bus, id, itemParams || {} );
        });

        if (params.time_check) {
            setInterval(() => this.dallasTemps.forEach((item) => item.check()), params.time_check * 1000);
        }
    }
}

module.exports = OneWirePort;
