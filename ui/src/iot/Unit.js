import UnitStore from '../stores/UnitStore'
//import { observer } from 'mobx-react'
//import { observable } from 'mobx'

import Switch from './Switch'
import Button from './Button'
import DallasTemp from './DallasTemp'

class Unit {
    mqtt = null
    constructor(name, location) {
        console.log('construct new Unit', name)
        this.store = new UnitStore()

//        this.mqtt = mqtt;
        this.name = name;
        this.location = location;
        this.topic = location + '/' + name + '/'


        this.config = localStorage.getItem(this.topic)
        if (this.config) {
            console.log("Loaded conf", this.config);
//        } else {
//            mqtt.pub(this.topic + 'need_config', null, {wait_connect: true})
//            console.log("Empty conf", this.config);
        }


        this.config = {
            title: 'Большой серый холодильник',
            brand: 'Daewoo',
            model: 'FR-530',
            image: '/images/daewoo/fr-530.png',
            name: 'wi-frost',
            location: 's-home',
            devs: [
                {
                    pin: 4,
                    type: 'onewire',
                    name: 'temp_sensors',
                    title: 'Шина 1-wire'
                },
                {
                    pin: 5,
                    type: 'switch',
                    name: 'compressor',
                    title: 'Компрессор'
                },
                {
                    pin: 18,
                    type: 'switch',
                    name: 'compressor_fan',
                    title: 'Вентилятор компрессора'
                },
                {
                    pin: 19,
                    type: 'switch',
                    name: 'heater',
                    title: 'Отопитель'
                },
                {
                    pin: 21,
                    type: 'switch',
                    name: 'fan',
                    title: 'Вентилятор морозилки'
                }
            ],

            onewire: [
                {
                    id: '284d341104000093',
                    type: 'temp1wire',
                    name: 'moroz',
                    title: 'Морозильная камера'
                },
                {
                    id: '28bf19110400009b',
                    type: 'temp1wire',
                    name: 'body',
                    title: 'Холодильная камера'
                }
            ]
        }

        this.init(this.config)

    }

    init(config) {
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
            mqtt.sub(this.topic + 'config', (value) =>
                console.log('get config', value)
    //            this.store.addLog(value)
            )
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
