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
    values = {}
    log = []

    constructor() {
        makeAutoObservable(this)
//        makeObservable(this, {
//            state: observable,
//            ports: observable,
//            log: observable,
//            values: computed,
//            currentState: computed,
//            setState: action,
//            setValue: action,
//            addPort: action,
//        });

//        this.state
      // autorun(() => console.log('Autorun', this.state, this.ports.length, this.values));
    }
    get currentState() {
        const title = stateTitles[this.state] || stateTitles.unknown
//        console.log('UnitStore get currentState', this.state, title)
        return {
            state: this.state,
            title
        }
    }
//    get values() {
//        //return {}
//        const values =  this.ports.reduce((obj, port) => {
//            obj[port.name] = port.beautify ? port.beautify(port.value) : port.value
//            return obj
//        }, { state: stateTitles[this.state] });
//        console.log('UnitStore getValues', values)
//        return values
//
//    }

    getPort(name) {
        this.ports.find((port) => port.name === name)
    }

    addPort(port) {
        this.ports.push(port);
    }

    addLog(value) {
//        console.log('UnitStore addLog', value)
        this.log.push(value)
    }
    setState(value) {
//        console.log('UnitStore setState', value)
        this.state = value
    }

    setValue(name, value) {
        let port = this.ports.find( (port) => port.name === name )
        console.log('UnitStore setValue', name, value, port)
        if (port) {
            port.value = value

            this.values =  this.ports.reduce((obj, port) => {
                obj[port.name] = port.beautify ? port.beautify(port.value) : port.value
                return obj
            }, { state: stateTitles[this.state] });
        }
    }
}

export default UnitStore
