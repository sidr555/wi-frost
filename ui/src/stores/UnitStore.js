import { makeAutoObservable } from 'mobx'

class UnitStore {

    state = ''
    devs = []
    devTitles = {}
    values = {}
    log = []
    stateTitles = {}
//    config = {}

    constructor() {
        makeAutoObservable(this)
    }
    get currentState() {
        const title = this.stateTitles[this.state] || this.stateTitles.unknown || ''
//        console.log('UnitStore get currentState', this.state, title)
        return {
            state: this.state,
            title
        }
    }

    set states(obj) {
        this.stateTitles = obj
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
        this.devTitles[dev.name] = dev.title;
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
        let dev = this.devs.find( (dev) => dev.name === name )
//        console.log('UnitStore setValue', name, value, dev)
        if (dev) {
            dev.value = value

            this.values =  this.devs.reduce((obj, dev) => {
                obj[dev.name] = dev.beautify ? dev.beautify(dev.value) : dev.value
                return obj
            }, { state: this.stateTitles[this.state] });
        }
    }
}

export default UnitStore
