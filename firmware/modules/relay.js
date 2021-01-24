// Use this to switch relays smartly
const DevPort = require('dev');

const HIGH = 0;
const LOW = 1;

class RelayPort extends DevPort {

    constructor(params, chk) {
        super(params);
        this.time = null;
    }

    set(value, force = false) {
        if (super.set(value, force)) {
            if (!this.time || force || chk(act)) {
                // console.log('set relay on pin', pin, act)
                console.log('switch ' + this.name + ' ' + act ? 'ON' : 'OFF');
                this.time = require('now').now();
                this.act = act;
                digitalWrite(this.pin, act ? HIGH : LOW);
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
