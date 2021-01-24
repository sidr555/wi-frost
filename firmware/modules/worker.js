const storage = require('Storage');

class Worker {
    constructor() {
        this.conf = storage.readJSON("job.json");
        if (!this.conf) {
            console.log("Не найдена конфигурация co списком работ job.json, создана пустая конфигурация.");
            this.conf = [];
            storage.writeJSON("job.json", this.conf);
        }

        console.log("Construct WORKER", this.topic);

        this.jobs = [];
        if (this.conf.length) {
            this.jobs = this.conf.map((params) => new Job(params));
        }

        console.log("Worker jobs", this.jobs);
    }
}


module.exports = new Worker();
