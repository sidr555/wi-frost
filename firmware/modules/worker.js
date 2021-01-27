const storage = require('Storage');
const Job = require('job');
const logable = require('logable');
// const unit = require('unit');

class Worker {
    constructor(unit) {
        try {
            this.name = unit.topic;
            this.logType = 'Worker';
            this.unit = unit;
            this.conf = storage.readJSON("job.json");

            if (!this.conf) {
                this.log("Не найдена конфигурация co списком работ job.json, создана пустая конфигурация.");
                this.conf = [];
                storage.writeJSON("job.json", this.conf);
            }

            this.currentJob = null;

            this.log("Construct ", unit.topic);

            this.jobs = [];
        } catch (e) {
            console.log("Exception in worker constructor", e);
            throw e;
        }
    }

    build() {
        try {
            //console.log('build worker', this.conf);
            if (this.conf.length) {
                this.jobs = this.conf.map((conf) => {
                    //console.log('create job from conf', conf)
                    const job = new Job(conf, this.unit);
                    job.logging = job.conf.log || false;
                    job.silent = job.conf.silent || false;
                    console.log('build job')
                    job.build({
                        runner: this.runJob
                    });

                    // subscribe local events
                    console.log('subscribe job', job.name)
                    if (!job.buggy && !job.command) {
                        Object.keys(job.topics).forEach((topic) => {
                            if (topic.substr(0, 2) == './') {
                                // run job on unit dev update
                                //this.log('subscribe local dev on topic', topic);
                                const dev = this.unit.devs[topic.substr(2)];
                                if (dev) {
                                    dev.sub(job.name, (value) => {
                                        if (!job.active) {
                                            this.log(job.name + ' checks ' + dev.name + " : " + value);
                                            this.log('topic ' + topic);
                                            job.topics[topic] = value;
                                            if (job.matchConditions()) {
                                                this.runJob(job);
                                            }
                                        }
                                    });
                                }
                            }
                        });
                    }

                    return job;
                });
            }


            this.log("Worker jobs", this.jobs.length, unit.name);

        } catch(e) {
            console.log("Exception in worker build", e)
        }
    }

    runJob(job) {
        // this.log('try to run job', job.name);

        if (!job.active) {
            // todo some checks of previous job limits

            if (this.currentJob && !this.currentJob.stop()) {
                this.log('Can not stop current job ' + job.name);
                return false;
            }

            if (true) {
                if (job.run()) {
                    this.log('job is ran successfully', job.name);
                    return true;
                }
            }
        }
        return false;
    }


    useMQTT(mqtt) {
        try {
            this.log("useMQTT");

            mqtt.sub(this.unit.topic + 'conf/unit/get', () => {
                this.log('unit conf request recieved');
                mqtt.pub(this.unit.topic + 'conf/unit', this.unit.conf);
            });
            mqtt.sub(this.unit.topic + 'conf/jobs/get', () => {
                this.log('jobs conf request recieved');
                mqtt.pub(this.unit.topic + 'conf/job', this.conf);
            });
            // mqtt.sub(this.unit.topic + 'conf/1wire/get', () => {
            //     this.log('onewire request recieved');
            //     const items = this.unit.devs.onewire.dallasTemps.map((item) => {
            //         return {
            //             id: item.id,
            //             conf: item.conf,
            //             value: item.value
            //         };
            //     });
            //     mqtt.pub(unit.topic + 'conf/1wire', items);
            // });
            mqtt.sub(this.unit.topic + 'test', function(data) {
                this.log('recieved MQTT', data);
            });

            // Broadcast unit dev`s updates
            Object.keys(this.unit.devs).forEach((name) => {
                console.log("Broadcast unit dev`s updates", name)
                let dev = this.unit.devs[name];
                if (dev && !dev.silent) {
                    dev.sub('mqtt', (value) => mqtt.pub(this.unit.topic + 'dev/' + name, value));
                }
            });

            this.jobs.forEach((job) => {
                if (!job.buggy) {

                    if (job.command) {
                        // run job on external run-command
                        mqtt.sub(this.unit.topic + 'job/' + job.command, () => {
                            if (job.matchConditions()) {
                                this.runJob(job);
                            }
                        });

                    } else {
                        Object.keys(job.topics).forEach((topic) => {
                            if (topic.substr(0, 2) !== './') {
                                // run job on match any other mqtt topic
                                mqtt.sub(topic, (name, value) => {
                                    job.topics[topic] = value;
                                    if (job.matchConditions()) {
                                        this.runJob(job);
                                    }
                                });
                            }
                        });
                    }
                }
            });
        } catch (e) {
            this.log("useMQTT", e.message);
            this.error("useMQTT", e);
        }
    }
}

Object.assign(Worker.prototype, logable, {logLimit: 1000});

module.exports = Worker;
