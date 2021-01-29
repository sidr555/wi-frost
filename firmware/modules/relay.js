// Use this to switch relays smartly
const Actor = require('actor');

const HIGH = 0;
const LOW = 1;

class Relay extends Actor {

    constructor(conf) {
        try {
            super(conf, 0);
            this.pin = conf.pin;
            this.logType = 'Relay';

            // setTimeout(() => this.set(this.value, true), 2000);
            this.set(this.value, true);

        } catch (e) {
            console.log("Exception in relay constructor", e);
            throw e;
        }
    }


    canSet(value) {
        if (!super.canSet(value)) {
            return false;
        }
        if (!this.value && value) {
            if (this.conf.schedule) {
                return false;
            }
            if (this.conf.minOnTime && this.elapsedTime() < this.humanToSec(this.conf.minOnTime)) {
                this.log('Cannot set, minOnTime=' + this.conf.minOnTime, [this.elapsedTime()]);
                return false;
            }
        }
        if (this.value && !value) {
            if (this.conf.minOffTime && this.elapsedTime() < this.humanToSec(this.conf.minOffTime)) {
                this.log('Cannot set, minOffTime=' + this.conf.minOffTime, [this.elapsedTime()]);
                return false;
            }
        }
        return true;
    }


    set(value, force) {
        if (!this.time || force) {
            if (super.set(value)) {
                // console.log('switch ' + this.name + ' ' + (value ? 'ON' : 'OFF'));
                digitalWrite(this.pin, value ? HIGH : LOW);
                return true;
            }
        }
        return false;
    }

    on(force) {
        // this.log("Turn relay ON");
        return this.set(true, force);
    }
    off(force) {
        // this.log("Turn relay OFF");
        return this.set(false, force);
    }


}

module.exports = Relay;
