import Port from './Port';

class TempSensor extends Port {
    constructor(name, pin) {
        super(name, pin)
        this.type = 'temp'
        console.log("Construct temp sensor", name, pin)
    }

    sub(value) {
        this.value = parseInt(value[0]*10)/10
        if (this.value > 0) {
            this.value = "+" + this.value;
        }
        console.log("Message for temp sensor", this.name, this.value, value)
    }
}

export default TempSensor;
