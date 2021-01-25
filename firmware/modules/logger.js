// Bacis self-logger

const Logger = {
    _log: [],
    logLimit: 100,

    log(data) {
        if (this.logLimit) {
            data.name = this.name;
            data.time = new Date();
            if (typeof this.value !== 'undefined') {
                data.value = this.value;
            }

            console.log('LOG [' + this.name + '] >>', data);

            this._log.push(data);
            if (this._log.length > this.logLimit) {
                this._log.shift();
            }
        }
    }
}

module.exports = Logger;
