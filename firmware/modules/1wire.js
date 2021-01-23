// Use this to work with 1-wire bus

const DallasTemp = require('dallas_temp');

class OneWirePort {
    constructor(params, items) {
        this.name = params.name;
        this.pin = params.pin;

        const bus = new OneWire(params.pin);

        this.ids = bus.search();
        this.dallasTemps = this.ids.map( (id) => {
            const itemParams = items.filter( (item) => item.id === id );
            return new DallasTemp( bus, id, itemParams || { name: '' } );
        });

        if (params.time_check) {
            setInterval(() => this.dallasTemps.forEach((item) => item.check()), params.time_check * 1000);
        }
    }
}

module.exports = OneWirePort;

// module.exports = function(conf) {
//     const ow = new OneWire(conf.pin);
//
//     this.dallasTemp = ow.search().map( (id) => {
//         const dev = require('DS18B20').connect(ow, id);
//         const obj = {
//             id: id,
//             dev: dev,
//             check: () => {
//                 dev.getTemp( (temp) => {
//                     obj.temp = temp;
//                     log('Check temp', id, temp);
//                 });
//             }
//         };
//         obj.check();
//         setInterval(obj.check, conf.time_check * 1000);
//         return obj;
//     }, {});
//
//
// };
