//import Unit from 'Unit';
class Dev {
    constructor(unit, name, pin) {
        this.unit = unit;
        this.name = name;
        this.pin = pin;
        this.topic = this.unit.topic + '/' + this.name;
    }
}

//const In = {
//
//}
//
//const Out = {
//
//}

export default Dev;
