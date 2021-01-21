import { makeObservable, observable, computed, action, autorun } from 'mobx'

class UnitStore {

    constructor() {
        this.state = 'wait'
        this.ports = []
        this.log = []
        makeObservable(this, {
            state: observable,
            ports: observable,
            log: observable,
            values: computed,
            setState: action,
            setValue: action,
            addPort: action,
        });
      // autorun(() => console.log('Autorun', this.state, this.ports.length, this.values));
    }
    get values() {
        console.log('UnitStore getValues')
        return this.ports.reduce((obj, port) => {
            obj[port.name] = port.beautify ? port.beautify(port.value) : port.value
            return obj
        }, {});
    }

    getPort(name) {
        this.ports.find((port) => port.name === name)
    }

    addPort(port) {
        this.ports.push(port);
    }

    addLog(value) {
        console.log("UnitStore addLog", value)
        this.log.push(value)
    }
    setState(value) {
        console.log("UnitStore setState", value)
        this.state = value
    }
    setValue(name, value) {
        console.log("UnitStore setValue", name, value)
        let port = this.ports.find( (port) => port.name === name )
        if (port) {
            port.value = value
        }
    }
}

export default UnitStore
