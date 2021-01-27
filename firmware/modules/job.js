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

            this.limits = {
                minTime: null,
                maxTime: null
            };
            this.conditions = [];
            this.actions = {};         // object of dev_name: new_value
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
                                        this.topics[condition.topic] = 0//this.unit.getValue(condition.topic);
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


            // if (!this.buggy && !this.command) {
            //     Object.keys(this.topics).forEach((topic) => {
            //         if (topic.substr(0, 2) === './') {
            //             // run job on unit dev update
            //             const name = topic.substr(2);
            //             if (this.unit.devs[name]) {
            //                 this.unit.devs[name].sub(job.name, (value) => {
            //                     this.log('updated dev state: ' + name, job.topics);
            //                     this.topics[topic] = value;
            //                     if (this.matchConditions()) {
            //                         params.runner(this);
            //                         //this.runJob(job);
            //                     }
            //                 });
            //             }
            //         }
            //     });
            // }


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
            console.log('    conditions', condition.toString(), value, this.topics[condition.topic]);

            this.log(condition.toString(), ' ??? ', value);
            if (value !== null && condition.match(value)) {
                console.log('Match!');
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
        this.log('Run!', {force: force});
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
                this.log('Run action ' + name);
                count ++;
            }
            total++;
            return count;
        }, 0);

        this.log('Run ' + count + '/' + total + ' actions');

        if (this.conf.maxTime) {
            setTimeout(() => this.stop(), this.conf.maxTime * 1000);
        }

        return count === total;
    }

    stop() {
        if (this.active) {
            console.log('Stop the job', this.name);
            this.startTime = 0;
            this.force = false;
        }
    }

    get active() {
        return this.startTime > 0;
    }

    canBeStopped() {
        if (this.conf.minTime > 0 && this.elapsedTime() < this.conf.minTime) {
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
