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


        mqtt.sub([location, name, 'state'].join('/'), (value) => this.store.setState(value) )

        mqtt.sub([location, name, 'log'].join('/'), (value) => this.store.addLog(value) )
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
