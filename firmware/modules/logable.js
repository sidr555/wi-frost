// Bacis self-logger

const logStore = {};
const errStore = {};

const Logable = {
    logging: true,
    logLimit: 10,
    logType: '',

    make: function(text, data) {
        if (typeof  text === 'object') {
            data = {value: text};
            text = '';
        }

        const rec = {
            //name: this.name,
            time: new Date(),
            text: text
        }
        if (data) {
            rec.data = data;
        }
        if (typeof this.value !== 'undefined') {
            rec.value = this.value;
        }
        return rec
    },
    log: function(text, data) {
        if (this.logging) {

            if (!logStore[this.name]) {
                logStore[this.name] = [];
            }
            const rec = this.make(text, data)

            console.log(this.logType, '>> [' + this.name + '] >>', rec.text, data || '');

            logStore[this.name].push(rec);
            if (logStore[this.name].length > this.logLimit) {
                logStore[this.name].shift();
            }
        }
    },

    error: function(text, data) {
        if (this.logging) {
            const rec = this.make(text, data)

            if (!errStore[this.name]) {
                errStore[this.name] = [];
            }

            console.log('ERROR>> [' + this.name + '] >>', rec.text, data || '');

            errStore[this.name].push(rec);
            if (errStore[this.name].length > this.logLimit) {
                errStore[this.name].shift();
            }
        }

    }
}

module.exports = Logable;
