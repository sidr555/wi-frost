const operators = ['=', '!=', '<', '<=', '>', '>='];

class Condition {
    constructor(topic = '', operator = '=', value = '') {
        console.log('New condition', topic, operator, value);
        this.topic = topic;
        this.operator = operator;
        this.value = value;
        this._log = [];
    }

    toString() {
        return [this.topic, this.operator, this.value].join(' ');
    }

    static parse(str) {
        console.log('Parse condition from ', str);
        if (str[0] === '!') {
            // run job topic
            return new Condition(arr[0], operators[i], arr[1]);

        }
        for (let i=0; i<operators.length; i++) {
            let arr = str.split(' ' + operators[i] + ' ');
            if (arr.length === 2) {
                return new Condition(arr[0], operators[i], arr[1]);
            }
        }
        return null;
    }

    match(value) {
        console.log('Check condition match value', this.toString(), value);
        switch (this.operator) {
            case '=':
                return value == this.value;
            case '>':
                return value > this.value;
            case '>=':
                return value >= this.value;
            case '<':
                return value < this.value;
            case '<=':
                return value <= this.value;
            case '!=':
                return value != this.value;
            default:
                return false;
        }
    }
}

module.exports = Condition;
