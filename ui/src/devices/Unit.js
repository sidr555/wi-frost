//import { makeAutoObservable } from "mobx"
//import { useLocalObservable } from 'mobx-react'

class Unit {
    constructor(name, location, store, mqtt) {
//        makeAutoObservable(this);

        this.store = store

        this.mqtt = mqtt;
        this.name = name;
        this.location = location;
        this.topic = location + '/' + name

        mqtt.sub([location, name, 'state'].join('/'), (value) => store.setState(value))
        mqtt.sub([location, name, 'log'].join('/'), (value) => store.addLog(value))
    }

    addPort(port) {
        this.store.addPort(port);
        port.setUnit(this)
        return port
    }

    getPort(name) {
        return this.store.getPort(name)
//        return this.store.ports.find((port) => port.name === name)
    }
}

export default Unit;
