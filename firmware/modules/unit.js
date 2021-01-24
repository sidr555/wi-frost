// Current unit configuration and routines

const storage = require("Storage");
const devFactory = require("dev_factory");

class Unit {
    constructor() {
        this.conf = storage.readJSON("unit.json");
        if (!this.conf) {
            throw new Error("Не найдена конфигурация контроллера unit.json");
        }

        this.name = this.conf.name;
        this.location = this.conf.location;

        console.log("Construct UNIT", this.topic);

        this.devs = [];
        if (this.conf.devs && this.conf.devs.length) {
            this.devs = this.conf.devs.reduce((devs, dev) => {
                devs[dev.name] = devFactory(dev.type, dev, this.conf);
                return devs;
                // switch (dev.type) {
                //     case 'relay':
                //         log("Initialize new Relay " + dev.name + ' on port ' + dev.pin);
                //         devs[dev.name] = new RelayPort(dev, ()=>1);
                //         if (dev.default) {
                //             devs[dev.name].on();
                //         } else {
                //             devs[dev.name].off();
                //         }
                //         break;
                //     case 'onewire':
                //         log("Initialize new 1-wire bus on port " + dev.pin);
                //         devs[dev.name] = new OneWirePort(dev, unitconf.onewire);
                //         break;
                //     default:
                //         log("Ignore unknown dev type: " + dev.type);
                // }
            }, {});
        }

        console.log("Unit devices", Object.keys(this.devs));
        console.log("1-wire IDs", this.devs.onewire.ids);

        this._log = [];
    }

    get topic() {
        return this.location + '/' + this.name + '/';
    }

    log(params) {
        params.time = new Date();
        console.log("UNIT log", params);
        this._log.push(params);
        if (this._log.length > 100) {
            this._log.shift();
        }
    }
}

module.exports = new Unit();
