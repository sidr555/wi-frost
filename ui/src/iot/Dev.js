
class Dev {
    subscriber: false
    value: null

    constructor({ name, pin, type, title }) {
        this.name = name;
        this.pin = pin;
        this.type = type || 'unknown'
        this.title = title

    }

    setUnit(unit) {
        this.unit = unit;
        this.mqtt = unit.mqtt;
        this.topic = [unit.location, unit.name, this.type, this.name].join('/')

//        console.log('set unit', this, this.subscriber)

        if (this.subscriber) {
            this.mqtt.sub(this.topic, (value) => {
                if (this.parse) {
                    value = this.parse(value)
                }
                unit.store.setValue(this.name, value)
            })
        }
    }

}

export default Dev;
