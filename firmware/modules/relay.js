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

            this.minOnTime = this.conf.minOnTime ? this.humanToSec(this.conf.minOnTime) : 0;
            this.minOffTime = this.conf.minOffTime ? this.humanToSec(this.conf.minOffTime) : 0;

            if (this.conf.schedule) {

            }

            // this.chk = chk
            console.log('RELAY on port ' + this.pin, this.name, ' : ', conf.default ? 'on' : 'off' );
            // setTimeout(() => this.set(this.value, true), 2000);
            this.set(this.value, true);

        } catch (e) {
            console.log("Exception in relay constructor", e);
            throw e;
        }
    }


    canSet(value) {
        if (super.beforeSet(value)) {
            if (!this.value && value) {
                if (this.schedule) {
                    return false;
                }
                return !this.minOffTime || this.elapsedTime() >= this.minOffTime;
            }
            if (this.value && !value) {
                return !this.minOnTime || this.elapsedTime() >= this.minOnTime;
            }
        }
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
