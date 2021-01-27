const logable = require('logable');
const timeable = require('timeable');
const observable = require('observable');

const Condition = require('condition');

class Job {
    constructor(conf, unit) {
        try {
            this.conf = conf || {};
            this.name = conf.name || 'Unknown JOB';
            this.buggy = false; // true on some config errors
            this.unit = unit;

            //console.log('New job', this.name, conf);

            // this.limits = {
            //     minTime: null,
            //     maxTime: null
            // };
            this.conditions = [];
            if (this.conf.actions) {
                this.actions = this.conf.actions;
            } else {
                this.actions = {};         // object of dev_name: new_value
                this.buggy = true;
            }


            if (this.conf.minTime) {
                this.minTime = this.humanToSec(this.conf.minTime)
            }

            if (this.conf.maxTime) {
                this.maxTime = this.humanToSec(this.conf.maxTime)
            }

            console.log('!!!!!' + this.name, this.minTime, this.maxTime);

            this.command = null;

        } catch(e) {
            console.log('Exception in job constructor', JSON.stringify(e))
        }
    }

    build() {
        try {
            this.topics = {};
            if (this.conf) {

                //this.log("Parse job conditions", conf.conditions)

                if (this.conf.conditions && this.conf.conditions.length) {
                    this.conf.conditions.forEach((str) => {
                        if (str[0] === '!') {
                            this.command = str.substr(1);

                        } else if (str.length) {
                            str.split(' and ').forEach((chunk) => {
                                try {
                                    const condition = Condition.parse(chunk);
                                    if (condition) {
                                        this.conditions.push(condition);

                                        if (condition.devName) {
                                            this.topics[condition.topic] = this.unit.getValue(condition.devName);
                                        }
                                    } else {
                                        this.buggy = true;
                                    }
                                } catch(e) {
                                    this.buggy = true;
                                }
                            });
                        }
                    })
                }
            }

            console.log('  conditions:', this.conditions);

            // this.force = false;
            // this.startTimer();

            console.log('New Job - ' + this.name/*, this.conf*/);
        } catch (e) {
            console.log("Exception in job constructor", e);
            throw e;
        }
    }

    matchConditions() {
        //this.log('Check job is match all the conditions', this.name, this.conditions, this.topics);
        const count = this.conditions.reduce((count, condition) => {

            // todo compressor:rest
            const value = this.topics[condition.topic];
            // this.log(condition.toString() + ' ??? ' + value);
            if (condition.match(value)) {
                this.log(condition.toString(), [value]);
                count++;
            }
            return count;
        }, 0);

        this.log('match ' + count + '/' + this.conditions.length + ' conditions');
        return count === this.conditions.length;
    }

    save() {

    }


    run(force) {
        this.log('Run job');
        // todo check limits

        // Check all the actions could ran

        this.startTime = new Date();
        this.force = force;

        let total = 0;
        const count = Object.keys(this.actions).reduce((count, name) => {
            const value = this.actions[name];
            // this.log('Try to run action', {name:name, value:value, force:force});

            if (name[0] == '@' && this.notify(name.substr(1), value)) {
                count++;
            } else if (this.unit.devs[name] && this.unit.devs[name].set(value)) {
                this.log('Run action ' + name, [value]);
                count ++;
            }
            total++;
            return count;
        }, 0);

        this.log('Run ' + count + '/' + total + ' actions');

        this.startTimer();

        if (this.conf.maxTime) {
            setTimeout(() => this.stop(), this.conf.maxTime * 1000);
        }

        return count && count === total;
    }

    stop() {
        if (this.active && this.canBeStopped()) {
            console.log('Stop the job', this.name);
            this.startTime = 0;
            this.force = false;
            return true;
        }
        return false;
    }

    get active() {
        return this.startTime > 0;
    }

    canBeStopped() {
        if (this.minTime > 0 && this.elapsedTime() < this.minTime) {
            this.log("can not stop because of minTime");
            return false;
        }
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
Object.assign(Job.prototype, logable, timeable, observable, {logType: "JOB"});

module.exports = Job;
