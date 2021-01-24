// Use this to switch relays smartly
// const now = require('now').now;

const HIGH = 0;
const LOW = 1;

class RelayPort {

    constructor(params, chk) {
        this.time = null;
        this.act = null;
        this.name = params.name;
        this.pin = params.pin;

        this.on = this.set(HIGH);
        this.off = this.set(LOW);
    }

    set(act) {
        return (force) => {
            if (this.act === act) return true;
            if (!this.time || force || chk(act)) {
                // console.log('set relay on pin', pin, act)
                console.log('switch ' + this.name + ' ' + (act === HIGH ? 'ON' : 'OFF'));
                this.time = require('now').now();
                this.act = act;
                digitalWrite(this.pin, act);
                return true;
            }
            return false;
        }
    }
}

module.exports = RelayPort;
