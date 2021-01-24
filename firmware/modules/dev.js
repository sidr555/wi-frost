// Bacis unit port device

class DevPort {

    constructor(params) {
        this.name = params.name;
        this.pin = params.pin;
        this.value = params.default || null;

        console.log("New DEV", this.name, this.pin, this.value);

        this._log = [];
    }

    set(value, force) {
        if (this.value !== value) {
            console.log("Set DEV value", this.name, value, force);

            this.value = value;
            return true;
        }
        return false;
    }

    log(params) {
        // param.name = this.name;
        params.time = new Date();
        params.value = this.value
        console.log("DEV log", this.name, params);
        this._log.push(params);
        if (this._log.length > 100) {
            this._log.shift();
        }
    }
}

module.exports = DevPort;
