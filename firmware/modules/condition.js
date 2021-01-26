// const unit = require('unit');

const operators = ['=', '!=', '<', '<=', '>', '>=', 'run'];

class Condition {
    constructor(topic, operator, value) {
        try {
            // this.topic = topic.substr(0,2) === './' ? unittopic + 'dev/' + topic.substr(2) : topic;
            this.topic = topic;
            this.operator = operator;
            this.value = value;

            console.log('New condition', topic, operator, value);
        } catch (e) {
            console.log("Exception in unit constructor", e);
            throw e;
        }
    }

    toString() {
        return [this.topic, this.operator, this.value].join(' ');
    }

    static parse(str) {
        console.log('Parse condition from ', str);

        for (let i=0; i<operators.length; i++) {
            let arr = str.split(' ' + operators[i] + ' ');
            if (arr.length === 2) {
                return new Condition(arr[0], operators[i], arr[1]);
            }
        }

        return null;
    }

    match(currentValue) {
        console.log('Check condition match value', this.toString(), currentValue);

        let value = this.value;
        if (this.topic === '#clock') {
            currentValue = new Date();
            value = require('now').getTodayFromHuman(this.value);
        }

        switch (this.operator) {
            case 'run':
                return true;
            case '=':
                return currentValue == value;
            case '>':
                return currentValue > value;
            case '>=':
                return currentValue >= value;
            case '<':
                return currentValue < value;
            case '<=':
                return currentValue <= value;
            case '!=':
                return currentValue != value;
            default:
                return false;
        }
    }
}

module.exports = Condition;
