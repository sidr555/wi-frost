const Condition = require('condition');
const logger = require('logger');

class Job {
    constructor(conf) {
        this.name = conf.name;
        this.unit = unit;
        this.conf = conf;

        //console.log('New job', this.name, conf);

        this.limits = {
            minTime: null,
            maxTime: null
        };
         try {
             this.topics = {};
             if (this.conf) {
                 this.limits = conf.limits;

                 this.conditions = [];

                 if (conf.conditions[0] === '!') {
                     // run command
                     this.command = conf.conditions.substr(1);
                 } else {
                     // topic1 > 6.5 and topic2 != 0 and topic3 > 0
                     conf.conditions.split(' and ').forEach((str) => {

                         const condition = Condition.parse(str);
                         if (condition) {
                             this.conditions.push(condition);
                             this.topics[condition.topic] = null;
                         }
                     });
                 }

             } else {
                 this.actions = {};         // object of dev_name: new_value
                 this.conditions = [];
                 this.command = null;
             }
         } catch (e) {
             console.log("Exc job", e);
             throw e;
         }

        this.force = false;
        this.startTime = null;
        this._log = [];
        console.log('New Job - ' + this.name, this.conf);

    }

    //subscribes job on mqtt mesages from the main routine
    subscribe(next) {
        this.log && this.log('subscribe job', this.name);

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
            const value = this.topics[condition.topic];
            console.log('Check job condition is match value', value, condition.toString());
            if (value !== null && condition.match(value)) {
                console.log('Match!');
                count++;
            }
            return count;
        }, 0);

        console.log('Job match ' + count + '/' + this.conditions.length + ' conditions', this.name);
        return count === this.conditions.length;
    }

    save() {

    }

    run(force) {
        console.log('Run job', this.name, force);
        // todo check limits

        this.startTime = new Date();
        this.force = force;

        let total = 0;
        const count = Object.keys(this.actions).reduce((count, name) => {
            const value = this.actions[name];
            console.log('Try to run action', name, value, force);

            if (name[0] == '@' && this.notify(name.substr(1), value)) {
                count++;
            } else if (this.unit.devs[name] && this.unit.devs[name].set(value)) {
                console.log('Action is ran', name, value)
                // this.dev.log({
                //     type: 'job',
                //     job: this.name,
                //     force: force
                // });
                count ++;
            }
            total++;
            return count;
        }, 0);

        console.log('Ran ' + count + '/' + total + ' actions', this.name);
        return count === total;
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

    notify(channel, value) {
        switch(channel) {
            case 'topic':
                console.log("Notify with MQTT topic", value);
                break;
            case 'email':
                console.log("Notify with email", value);
                break;
            case 'sms':
                console.log("Notify with SMS", value);
                break;
            case 'tg':
                console.log("Notify with telegram", value);
                break;
            default:
                console.log("Notify with unknown channel", channel, value);
                return false;
        }
        return true;
    }
}
Object.assign(Job.prototype, logger);

module.exports = Job;
