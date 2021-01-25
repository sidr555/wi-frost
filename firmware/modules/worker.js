const storage = require('Storage');
const Job = require('job');
const logger = require('logger');
// const unit = require('unit');

class Worker {
    constructor(unit) {
        this.unit = unit;
        this.conf = storage.readJSON("job.json");
        if (!this.conf) {
            this.log("Не найдена конфигурация co списком работ job.json, создана пустая конфигурация.");
            this.conf = [];
            storage.writeJSON("job.json", this.conf);
        }

        this.log("Construct WORKER", unit.topic);


        this.jobs = [];
        if (this.conf.length) {
            this.jobs = this.conf.map((conf) => {
                const job = new Job(conf, unit);
                if (job.conf.log > 0) {
                    Object.assign(job, logger, { logLimit: job.conf.log});
                }
            });


        }

        this.log("Worker jobs", this.jobs.length, unit.name);
    }

    runJob(job) {
        this.log('try to run job', job.name);

        if (!job.active) {
            // todo some checks of previous job limits

            if (true) {
                if (job.run()) {
                    console.log('job is ran', job.name);
                }
            }
        }
    }

    subscribe(mqtt) {
        this.jobs.forEach((job) => {
            if (job.command) {
                mqtt.sub(this.unit.topic + 'job/' + job.command, () => job.matchConditions() && this.runJob(job));

            } else {
                job.topics.forEach((topic) => {
                    if (topic.substr(0,2) == './') {
                        const name = topic.substr(2);

                        if (this.unit.devs[name]) {
                            this.unit.devs[name].sub((value) => {
                                job.topics[topic] = value;
                                if (job.matchConditions()) {
                                    this.runJob(job);
                                }
                            });
                        }
                    } else {
                        mqtt.sub(topic, (value) => {
                            job.topics[topic] = value;
                            if (job.matchConditions()) {
                                this.runJob(job);
                            }
                        });
                    }
                });
            }

        });
    }
}

Object.assign(Worker.prototype, logger);

module.exports = Worker;
