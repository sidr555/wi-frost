// Bacis self-logger

const Logable = {
    logStore: [],
    errStore: [],
    logging: true,
    logLimit: 10,

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

            const rec = this.make(text, data)

            console.log('>> [' + this.name + '] >>', rec.text);

            this.logStore.push(rec);
            if (this.logStore.length > this.logLimit) {
                this.logStore.shift();
            }
        }
    },

    error: function(text, data) {
        if (this.logging) {
            const rec = this.make(text, data)

            console.log('ERROR>> [' + this.name + '] >>', rec.text);

            this.errStore.push(rec);
            if (this.errStore.length > this.logLimit) {
                this.errStore.shift();
            }
        }

    }
}

module.exports = Logable;
