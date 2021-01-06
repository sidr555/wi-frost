const Db = require('./redis_client');
const fs = require('fs');
const State = require('./device_state')

const defaultBrand = "Daewoo";
const defaultModel = "FR-530";
// const defaultSensors = {};
const defaultSensors = {
    moroz: null,
    body: null,
    compressor: null,
    unit: null,
    room: null
};
const defaultLimits = {
    moroz_start_temp: -10,
    moroz_stop_temp: -16,
    compressor_max_temp: 70,
    compressor_min_sleep: 1800,
    unit_max_temp: 40,
    delta_temp: 30,
    heater_start_hour: 15,
    heater_stop_minutes: 120
};



module.exports = function (id) {
    console.log("new Device", id);

    this.id = id;
    this.state = new State(this);


    this.getBrandModel = (next) => {
        // console.log("Get brand model");
        Db.get("model_" + this.id).then((value, err) => {
            // console.log("read brand", value, err);
            if (typeof next === "function") {
                next(err || !value ? {brand: defaultBrand, model: defaultModel} : JSON.parse(value), err);
                // console.log("11111");
            }
        });
    }

    this.getConfig = (next) => {
        // console.log("Get config");
        this.getBrandModel((data) => {
            let filename = 'config/' + data.brand.toLowerCase() + '/' + data.model.toLowerCase() + '.json';
            console.log("Read config file", filename);
            fs.readFile(filename, function (err, json) {
                if (err) throw new Error("Не найден файл конфигурации" + filename);
                let config = JSON.parse(json);
                if (typeof next === "function") {
                    next(config, null);
                }
            });
        });
    }

    this.getFullConfig = (next) => {
        // console.log("Get full config", this);
        this.getConfig((config, err) => {
            if (err) {
                next(config, err);
            }
            this.getSensors((sensors, err) => {
                if (!err) {
                    config.temp_sensors = sensors;
                }
                next(config, err);
            });
        });
    }

    this.getSensors = (next) => {
        Db.get("sensors_" + this.id).then((value, err) => {
            let sensors = err || !value ? defaultSensors : JSON.parse(value);
            if (typeof next === "function") {
                next(sensors, err);
            }
        });
    }

    this.setSensors = (sensors, next) => {
        Db.set("sensors_" + this.id, sensors).then(err => {
            if (typeof next === "function") {
                next(err);
            }
        });
    }

    this.getLimits = (next) => {
        Db.get("limits_" + this.id).then((value, err) => {
            let limits = err || !value ? defaultLimits : JSON.parse(value);
            console.log("get limits", value, limits);
            if (typeof next === "function") {
                next(limits, err);
            }
        });
    }

    this.setLimits = (limits, next) => {
        Db.set("limits_" + this.id, limits).then(err => {
            if (typeof next === "function") {
                next(err);
            }
        });
    }
}




