import Port from './Port';

class TempSensor extends Port {
    subscriber = true
    type = 'temp'
    value = 20

    constructor(name, pin) {
        super(name, pin)
        console.log("Construct temp sensor", name, pin)
    }

    parse(value) {
        return value[0]
    }

    beautify(value) {
        value = parseInt(value*10)/10
        if (value > 0) {
            value = "+" + value;
        }

        console.log("Message for temp sensor", this.name, value)
        return value
    }
}

export default TempSensor;
