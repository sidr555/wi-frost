// Current unit configuration and routines

const storage = require("Storage");
const devFactory = require("dev_factory");
// const observable = require("observable");
const logable = require("logable");
const timeable = require("timeable");


class Unit {
    constructor() {
        try {
            this.conf = storage.readJSON("unit.json");
            if (!this.conf) {
                throw new Error("Не найдена конфигурация контроллера unit.json");
            }

            this.name = this.conf.name;
            this.location = this.conf.location;

            // this.log("Construct UNIT", this.topic);

            this.devs = [];
            if (this.conf.devs && this.conf.devs.length) {
                this.devs = this.conf.devs.reduce((devs, dev) => {
                    devs[dev.name] = devFactory(dev.type, dev, this.conf);

                    if (dev.name === 'onewire' && devs.onewire.dallasTemps ) {
                        devs.onewire.dallasTemps.forEach((item) => {
                            if (item.name) {
                                devs[item.name] = item;
                            }
                        })
                    }
                    return devs;
                }, {});
            }

            this.log("Unit devices", Object.keys(this.devs));
            this.log("1-wire IDs", this.devs.onewire.ids);
        } catch (e) {
            console.log("Cannot build unit constructor", e.message);
            throw e;
        }
    }

    build() {

    }

    getValue(name) {
        const dev = this.devs[name];
        return dev ? dev.value : null;
    }

    get topic() {
        return this.location + '/' + this.name + '/';
    }

    state() {
        this.log("=== STATE ===");

        return Object.keys(this.devs).reduce((result, dev) => {
            if (dev.name) {
                this.log(dev.name + ' ' + dev.value);
                result[dev.name] = dev.value;
            }
            return result;
        }, {});
    }
}

Object.assign(Unit.prototype, logable, timeable, {logLimit: 1000});


module.exports = Unit;
