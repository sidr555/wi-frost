// Bacis unit port device

class DevPort {

    constructor(conf) {
        this.name = conf.name;
        this.pin = conf.pin;
        this.value = conf.default || null;

        console.log("New DEV", this.name, this.value);

        this._log = [];

    }

    set(value, force) {
        if (this.value !== value) {
            console.log("Set DEV value", this.name, value, force);
            this.value = value;

            this.subs.forEach((handle) => handle(this.value));

            return true;
        }
        return false;
    }

    log(data) {
        // param.name = this.name;
        data.time = new Date();
        data.value = this.value
        console.log("DEV log", this.name, data);
        this._log.push(data);
        if (this._log.length > 100) {
            this._log.shift();
        }
    }
}

module.exports = DevPort;
