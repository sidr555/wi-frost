import UnitStore from '../stores/UnitStore'
//import { observer } from 'mobx-react'
//import { observable } from 'mobx'

class Unit {
    constructor(name, location, mqtt) {
        this.store = new UnitStore()

        this.mqtt = mqtt;
        this.name = name;
        this.location = location;
        this.topic = location + '/' + name

//        setTimeout(() => {
//            this.store.setState('heat')
//        },2000)

//this.store.setState('heat')

        mqtt.sub([location, name, 'state'].join('/'), (value) => {
            console.log('update mqtt state', this.name, value);
            this.store.setState(value)
        })

//        mqtt.sub([location, name, 'log'].join('/'), (value) => this.store.addLog(value))
    }

    addPort(port) {
        this.store.addPort(port);
        port.setUnit(this)
        return this
    }

    getPort(name) {
        return this.store.getPort(name)
    }
}

export default Unit;
