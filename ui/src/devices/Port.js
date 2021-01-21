//import { makeAutoObservable } from "mobx"
//import { makeObservable, observable, action } from "mobx-react-lite"

class Port {
    value = 5
//    type

    constructor(name, pin) {
//        this.value = null



        this.name = name;
        this.pin = pin;
        this.type = 'unknown'

//        makeAutoObservable(this);
//        makeObservable(this, {
//            value: observable,
//            sub:    action
//        });
    }


    sub(value) {
        this.value = value
    }


    setUnit(unit) {
        this.unit = unit;
        this.mqtt = unit.mqtt;
        this.topic = [unit.location, unit.name, this.type, this.name].join('/')

        if (typeof this.sub === 'function') {
            this.mqtt.sub(this.topic, this.sub.bind(this));
        }
    }

}

export default Port;
