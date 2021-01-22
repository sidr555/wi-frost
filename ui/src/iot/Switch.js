import Dev from './Dev'

class Switch extends Dev {
    constructor({ name, pin, type, title }) {
        super({ name, pin, type, title })
        //this.type = 'switch'
    }

    on() {
        console.log("Turn " + this.name + " ON");
        //this.mqtt.pub(this.topic, 'on');
    }

    off() {
        console.log("Turn " + this.name + " OFF");
        //this.mqtt.pub(this.topic, 'off');
    }
}

export default Switch;

