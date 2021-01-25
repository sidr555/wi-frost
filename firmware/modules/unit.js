// Current unit configuration and routines

const storage = require("Storage");
const devFactory = require("dev_factory");
const publisher = require("publisher");
const logger = require("logger");


class Unit {
    constructor() {
        this.conf = storage.readJSON("unit.json");
        if (!this.conf) {
            throw new Error("Не найдена конфигурация контроллера unit.json");
        }

        this.name = this.conf.name;
        this.location = this.conf.location;

        this.log("Construct UNIT", this.topic);

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

        Object.keys(this.devs).forEach((name) => {
            const dev = this.devs[name];
            Object.assign(dev, publisher);
            if (dev.conf.log > 0) {
                Object.assign(dev, logger, {logLimit: dev.conf.log});
            }
        });

        this.log("Unit devices", Object.keys(this.devs));
        this.log("1-wire IDs", this.devs.onewire.ids);

    }

    useMQTT(mqtt) {
        Object.keys(this.devs).forEach((name) => {
            const dev = this.devs[name];
            if (dev && !dev.conf.silent && dev.subs && dev.subs.length >= 0) {
                //dev.subs = [];
                dev.subs.push((value) => mqtt.pub(this.topic + name, value));
            }
        })
    }

    get topic() {
        return this.location + '/' + this.name + '/';
    }
}

Object.assign(Unit.prototype, logger);
module.exports = Unit;
