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
            console.log("Publish value", this.name, value);

            Object.keys(this.store).forEach((name) => {
                console.log("pub for job", name);
                this.store[name](this.name, value);

            });
        }
    }
}

module.exports = Observable;
