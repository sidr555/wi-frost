// Bacis element that can change its state and notify others with observable

const logable = require('logable');
const timeable = require('timeable');
const observable = require('observable');

class Actor {

    constructor(conf) {
        this.conf = conf;
        this.name = conf.name;
        this.type = conf.type || "unknown";
        this.value = conf.default || null;

        //console.log("New Actor", this.name, conf);
    }

    get() {
        return this.value;
    }

    set(value, force) {
        if (this.value !== value) {
            this.log(value, {force:force});
            this.value = value;
            this.pub(value);
            return true;
        }
        return false;
    }
}

Object.assign(Actor.prototype, logable, timeable, observable);

module.exports = Actor;
