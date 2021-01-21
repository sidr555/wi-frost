//import { makeAutoObservable } from "mobx"
//import { makeObservable, observable, action } from "mobx-react-lite"

class Port {
    subscriber: false

    value: 5
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


//    decorate(value) {
//        return value
//    }
//    ba(value) {
//        return value
//    }


    setUnit(unit) {
        this.unit = unit;
        this.mqtt = unit.mqtt;
        this.topic = [unit.location, unit.name, this.type, this.name].join('/')

        console.log('set unit', this, this.subscriber)

        if (this.subscriber) {
            this.mqtt.sub(this.topic, (value) => {
                if (this.parse) {
                    value = this.parse(value)
                }
//                value = this.adopt(value);
                unit.store.setValue(this.name, value)
//                console.log('sub!', this.topic, value);
//                this.sub.bind(this));
            })
        }
    }

}

export default Port;
