import UnitStore from '../stores/UnitStore'
import UnitConfigStore from '../stores/UnitConfigStore'

import Dev from './Dev'
import Switch from './Switch'
import Button from './Button'
import DallasTemp from './DallasTemp'

//import DefaultConfig from '../config/freezer.default.json'

class Unit {
    mqtt = null
    constructor(name, location) {
        console.log('construct new Unit', name)

        this.name = name;
        this.location = location;
        this.topic = location + '/' + name + '/'

        this.store = new UnitStore()
        this.config = new UnitConfigStore(location + '/' + name)

        if (!this.config.name) {
//            this.config.update(DefaultConfig)
        }
        console.log('unit config', this.config.store)
       if (this.config.store.name) {
            this.init(this.config.store)
       }

       setTimeout(() => {
            this.config.title = "Hello"
       }, 3000);

    }

    init(config) {
        console.log('init config', config.name)

        this.store.states = config.states

        this.name = config.name
        this.title = config.title
        this.brand = config.brand
        this.model = config.model
        this.image = config.image

        config.devs.forEach((params) => {
            switch (params.type) {
                case 'onewire':
                    //this.addDev(new OneWire(params))
                    break
                case 'switch':
                    this.addDev(new Switch(params))
                    break
                case 'button':
                    this.addDev(new Button(params))
                    break
                default:
                    this.addDev(new Dev(params))
            }
        })

        config.onewire.forEach((params) => {
            this.addDev(new DallasTemp(params));
        })
    }


    useMqtt(mqtt) {
        if (!this.mqtt) {
            this.mqtt = mqtt;
            mqtt.sub(this.topic + 'state',  (value) => this.store.setState(value) )
            mqtt.sub(this.topic + 'log',    (value) => this.store.addLog(value) )
            mqtt.sub(this.topic + 'config', (value) => {
                console.log('get config', value);
                //this.saveConfig(value);
    //            this.store.addLog(value)
            })
            if (!this.config) {
                mqtt.pub(this.topic + 'need_config', null, {wait_connect: true})
                console.log("Empty conf", this.config);
            }

            this.store.devs.forEach((dev) => dev.setUnit(this) );
        }
    }

    addDev(dev) {
        this.store.addDev(dev);
        this.mqtt && dev.setUnit(this)
        return this
    }

    getDev(name) {
        return this.store.getDev(name)
    }
}

export default Unit;
