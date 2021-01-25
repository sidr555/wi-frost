// Bacis unit port device or 1wire point or anything else that can change its params and state

const Publisher = {
    _subs: [],

    sub(listener) {
        this._subs.push(listener)
    },
    pub() {
        console.log("Publish value", this.name, this.value);
        this.subs.forEach((listener) => listener(this.value));
    }
}

module.exports = Publisher;
