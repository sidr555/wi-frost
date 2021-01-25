// Use this to switch relays smartly
const DevPort = require('dev');

const HIGH = 0;
const LOW = 1;

class RelayPort extends DevPort {

    constructor(conf, chk) {
        super(conf);
        this.chk = chk
        console.log('Initialize new relay on port ' + this.pin, this.name);
        this.time = null;
        if (typeof conf.default !== 'undefined') {
            this.set(conf.default);
        }
    }

    set(value, force) {
        if (!this.time || force || this.chk(value)) {
            if (super.set(value, force)) {
                // console.log('set relay on pin', pin, act)
                console.log('switch ' + this.name + ' ' + value ? 'ON' : 'OFF');
                this.time = new Date();
                this.value = value;
                digitalWrite(this.pin, value ? HIGH : LOW);
                return true;
            }
        }
        return false;
    }

    on(force) {
        return this.set(true, force);
    }

    off(force) {
        return this.set(false, force);
    }
}

module.exports = RelayPort;
