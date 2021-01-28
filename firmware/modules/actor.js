// Bacis element that can change its state and notify others with observable

const logable = require('logable');
const timeable = require('timeable');
const observable = require('observable');

class Actor {

    constructor(conf, defaultValue) {
        this.conf = conf;
        this.name = conf.name;
        this.type = conf.type || "unknown";

        this.value = null;
        if (typeof conf.default !== 'undefined') {
            this.value = conf.default;
        } else if (typeof defaultValue !== 'undefined') {
            this.value = defaultValue;
        }

        //console.log("New Actor", this.name, conf);
    }

    get() {
        return this.value;
    }

    canSet(value) {
        return true;
    }

    set(value) {
        if (this.value !== value) {
            this.log(value);
            this.value = value;
            this.pub(value);

            this.startTimer();
            return true;
        }
        return false;
    }
}

Object.assign(Actor.prototype, logable, timeable, observable, {'logType' : 'Actor'});

module.exports = Actor;
