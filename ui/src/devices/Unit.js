//import { makeAutoObservable } from "mobx"
import { useLocalObservable } from 'mobx-react'
//import UnitStore from 'UnitStore'

class Unit {

    store = useLocalObservable(() => ({
        state: 'wait',
        ports: [],
        setValue(name, value) {
            if (name === 'state') {
                store.state = value
            } else {
                let port = store.ports.find( (port) => port.name === name )
                if (port) {
                    port.value = value
                }
            }
        }
    }))

    constructor(name, location, mqtt) {
//        makeAutoObservable(this);

        this.mqtt = mqtt;
        this.name = name;
        this.location = location;
        this.state = 'wait';
        this.ports = [];
    }

    addPort(port) {
        this.ports.push(port);
        port.setUnit(this)
        return port
    }

    getPort(name) {
        return this.port.find((port) => port.name === name)
    }
}

export default Unit;
