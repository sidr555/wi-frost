
class Switch {
    constructor(unit, name, pin) {
        super(unit, name, pin)
        this.type = 'relay'
    },

    on() {
        console.log("Turn " + name + " ON");
        this.mqtt.pub(this.topic, 'on');
    },
    off() {
        console.log("Turn " + name + " OFF");
        this.mqtt.pub(this.topic, 'off');
    }
}

export default Port;
