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
    devs = []
    values = {}
    log = []
//    config = {}

    constructor() {
        makeAutoObservable(this)
//        makeObservable(this, {
//            state: observable,
//            devs: observable,
//            log: observable,
//            values: computed,
//            currentState: computed,
//            setState: action,
//            setValue: action,
//            addDev: action,
//        });

//        this.state
      // autorun(() => console.log('Autorun', this.state, this.devs.length, this.values));
//      this.config = localStorage.getItem()
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
//        const values =  this.devs.reduce((obj, dev) => {
//            obj[dev.name] = dev.beautify ? dev.beautify(dev.value) : dev.value
//            return obj
//        }, { state: stateTitles[this.state] });
//        console.log('UnitStore getValues', values)
//        return values
//
//    }

//    getDev(name) {
//        this.devs.find((dev) => dev.name === name)
//    }

    addDev(dev) {
        this.devs.push(dev);
    }

    addLog(value) {
//        console.log('UnitStore addLog', value)
        this.log.push(value)
    }
    setState(value) {
//        console.log('UnitStore setState', value)
        this.state = value
    }

//    setConfig(data) {
//        console.log('UnitStore setConfig', data)
//        this.config = data
//    }


    setValue(name, value) {
        let dev = this.devs.find( (dev) => dev.name === name )
//        console.log('UnitStore setValue', name, value, dev)
        if (dev) {
            dev.value = value

            this.values =  this.devs.reduce((obj, dev) => {
                obj[dev.name] = dev.beautify ? dev.beautify(dev.value) : dev.value
                return obj
            }, { state: stateTitles[this.state] });
        }
    }
}

export default UnitStore
