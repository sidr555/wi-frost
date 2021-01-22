import { makeObservable, makeAutoObservable, observable, computed, action, autorun } from 'mobx'

const stateTitles = {
    wait: 'Недоступен',
    sleep: 'Сон',
    freeze: 'Охлаждение',
    heat: 'Разморозка',
    danger: 'Авария',
    unknown: 'Неизвестно'
};


class UnitStore {

    state = 'unknown'
    ports = []
    log = []

    constructor() {
//        makeAutoObservable(this)
        makeObservable(this, {
            state: observable,
            ports: observable,
            log: observable,
            values: computed,
            currentState: computed,
            setState: action,
            setValue: action,
            addPort: action,
        });

//        this.state
      // autorun(() => console.log('Autorun', this.state, this.ports.length, this.values));
    }
    get currentState() {
        const title = stateTitles[this.state] || stateTitles.unknown
        console.log('UnitStore get currentState', this.state, title)
        return {
            state: this.state,
            title
        }
    }
    get values() {
        //return {}
        console.log('UnitStore getValues')
        return this.ports.reduce((obj, port) => {
            obj[port.name] = port.beautify ? port.beautify(port.value) : port.value
            return obj
        }, { state: stateTitles[this.state] });
    }

    getPort(name) {
        this.ports.find((port) => port.name === name)
    }

    addPort(port) {
        this.ports.push(port);
    }

    addLog(value) {
        console.log('UnitStore addLog', value)
        this.log.push(value)
    }
    setState(value) {
        console.log('UnitStore setState', value)
        this.state = value
    }

    setValue(name, value) {
        console.log('UnitStore setValue', name, value)
        let port = this.ports.find( (port) => port.name === name )
        if (port) {
            port.value = value
        }
    }
}

export default UnitStore
