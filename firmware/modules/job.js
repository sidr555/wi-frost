const storage = require('Storage');

const store = storage.readJSON('job.json');

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

class Job {
    constructor(name, devs) {
        const params = store.find((job) => job.name == name);

        console.log('New job', name, params);

        this.name = name;
        this.devs = devs;
        this.topics = {};
        if (this.params) {
            this.limits = params.limits;

            this.conditions = [];
            // topic1 > 6.5 and topic2 != 0 and topic3 > 0
            params.conditions.split(' and ').forEach((str) => {
                const condition = Condition.parse(str);
                if (condition) {
                    this.conditions.push(condition);
                    this.topics[condition.topic] = null;
                }
            });
        } else {
            this.limits = {
                minWorkTime: null,
                maxWorkTime: null,
                allowedTimeRanges: []
            };

            // this.target = null;     // target action
            this.actions = [];      // array of {dev: name, value: val}
            // this.actors = [];       // array of object {topic: 'name', value: 'last_value', related_conds_ids: [...]}
            this.conditions = [];
        }
        this.force = false;
        this.startTime = null;
        this.runLog = [];
        console.log('Job constructed', this);

    }

    // subscribes job on mqtt mesages from the main routine
    subscribe(next) {
        console.log('subscribe job', this.name);

        Object.keys(this.topics).forEach((topic) => {
            next(topic, (value) => {
                console.log('Job ' + this.name + ' recieved a value ', value, ' of topic ', topic, this.active);
                this.topics[topic] = value;
                if (!this.active && this.matchConditions()) {
                    console.log('Run job because it matches all conditions', this.name);
                    // все условия совпали, запускаем задачу
                    if (this.run(false)) {
                        console.log('Job is ran', this.name);
                        this.log({
                            type: 'run',
                            topic: topic,
                            value: value
                        });
                    }
                } else if (this.active) {
                    if (this.stop()) {
                        this.log({
                            type: 'stop',
                            topic: topic,
                            value: value
                        });
                    }
                }
            });
        });
    }

    matchConditions() {
        console.log('Check job is match all the conditions', this.name, this.conditions, this.topics);
        const count = this.conditions.reduce((count, condition) => {
            if (condition.match(this.topics[condition.topic])) {
                console.log('Job condition is match', condition.toString());
                count++;
            }
            return count;
        }, 0);

        console.log('Job match ' + count + '/' + this.conditions.length + ' conditions', this.name);
        return count === this.conditions.length;
    }

    save() {

    }

    run(force = false) {
        console.log('Run job', this.name, force);
        // todo check limits

        this.startTime = new Date();
        this.force = force;

        const count = this.actions.reduce((count, action) => {
            console.log('Try to run action', action, force);
            if (this.devs[action.dev] && this.devs.set(action.value)) {
                console.log('Action is ran', action)
                this.dev.log({
                    type: 'job',
                    job: this.name,
                    // value: action.value,
                    force: force
                });
                count ++;
            }
            return count;
        }, 0);

        console.log('Ran ' + count + '/' + this.actions.length + ' actions', this.name);
        return this.actions.length === count;
    }

    stop() {
        console.log('Stop the job', this.name);
        this.startTime = 0;
        this.force = false;
    }

    get active() {
        return this.startTime > 0;
    }

    get elapsedTime() {
        return this.startTime ? parseInt((Date.now() -  this.startTime) / 1000) : 0;
    }

    log(params) {
        // params.name = this.name;
        params.time = new Date();
        params.value = this.value
        console.log('JOB log', this.name, params);
        this._log.push(params);
        if (this._log.length > 100) {
            this._log.shift();
        }
    }
}
