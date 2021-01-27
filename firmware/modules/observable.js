const store = {};
const Observable = {
    silent: false,

    sub: function(jobname, handler) {
        if (!store[this.name]) {
            store[this.name] = {};
        }
        store[this.name][jobname] = handler;
    },
    pub: function(value) {
        if (!this.silent) {
            if (typeof value === 'undefined') {
                value = this.value
            }
            // console.log("Publish value", this.name, value);

            Object.keys(store[this.name]).forEach((jobname) => {
                //console.log("pub for job", jobname);
                store[this.name][jobname](value);

            });
        }
    }
}

module.exports = Observable;
