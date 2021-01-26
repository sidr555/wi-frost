// Use this to switch relays smartly
const Actor = require('actor');

const HIGH = 0;
const LOW = 1;

class Relay extends Actor {

    constructor(conf) {
        try {
            super(conf);
            this.pin = conf.pin;
            // this.chk = chk
            console.log('Initialize new relay on port ' + this.pin, this.name, conf.default);
            if (conf.default) {
                setTimeout(() => this.on(true), 1000);
                // this.on(true);
            }
        } catch (e) {
            console.log("Exception in relay constructor", e);
            throw e;
        }
    }

    set(value, force) {
        if (!this.time || force) {
            if (super.set(value, force)) {
                console.log('switch ' + this.name + ' ' + value ? 'ON' : 'OFF');
                digitalWrite(this.pin, value ? HIGH : LOW);
                return true;
            }
        }
        return false;
    }

    on(force) {
        this.log("Turn relay ON");
        return this.set(true, force);
    }
    off(force) {
        this.log("Turn relay OFF");
        return this.set(false, force);
    }


}

module.exports = Relay;
