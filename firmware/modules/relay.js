// Use this to switch relays smartly
let now = require("now").Now;
module.exports = function(pin, chk) {
    this.time = null;
    this.act = null;

    let set = (act) => {
        return (force) => {
            if (this.act === act) return true;
            if (!this.time || force || chk(act)) {
                // console.log("set relay on pin", pin, act)
                this.time = now();
                this.act = act;
                digitalWrite(pin, act);
                return true;
            }
            return false;
        }
    };

    this.on = set(true);
    this.off = set(false);

};