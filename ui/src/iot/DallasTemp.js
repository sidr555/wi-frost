import Dev from './Dev';

class DallasTemp extends Dev {
    subscriber = true
    type = 'temp'
    value = null

    constructor({ name, id, type, title }) {
        const pin = id
        super({ name, pin, type, title })
//        console.log("Construct temp sensor", name, pin)
    }

    get topic() {
        return this.unit ? [this.unit.topic, this.type, this.name.substring(5)].join('/') : ''
    }

    parse(value) {
        return value[0]
    }

    beautify(value) {
        if (value === null) {
            return '-'
        }
        value = parseInt(value*10)/10
        if (value > 0) {
            value = "+" + value
        }
        value += " ̊ C"

        return value
    }
}

export default DallasTemp;
