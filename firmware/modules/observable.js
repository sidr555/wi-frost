const Observable = {
    store: {},
    silent: false,

    sub: function(id, handler) {
        this.store[id] = handler;
    },
    pub: function(value) {
        if (!this.silent) {
            if (typeof value === 'undefined') {
                value = this.value
            }
            // console.log("Publish value", this.name, value);
            for (const handler of this.store) {
                handler(value);
            }
            // this.store.forEach((listener) => listener(value));
        }
    }
}

module.exports = Observable;
