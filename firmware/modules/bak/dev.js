// Bacis unit port device

const logable = require('logable');
const observable = require('observable');

class Dev {

    constructor(conf) {
        try {
            this.conf = conf;
            this.name = conf.name;
            this.pin = conf.pin;
            this.value = conf.default || null;

            console.log("New DEV", this.name, this.value);

            this._log = [];
        } catch (e) {
            console.log("Exception in dev constructor", e);
            throw e;
        }
    }

    set(value, force) {
        if (this.value !== value) {
            this.log("Set DEV value", [value, force]);
            this.value = value;
            this.pub(value);
            return true;
        }
        return false;
    }
}

Object.assign(Dev.prototype, logable, observable);

module.exports = Dev;
