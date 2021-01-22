
class Dev {
    subscriber: false
    value: null

    constructor({ name, pin, type, title }) {
        this.name = name;
        this.pin = pin;
        this.type = type || 'unknown'
        this.title = title

    }

    get topic() {
        return this.unit ? [this.unit.topic, this.type, this.name].join('/') : ''
    }

    setUnit(unit) {
        this.unit = unit;
        this.mqtt = unit.mqtt;

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
