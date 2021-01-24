try {

const wifi = require('Wifi');
const storage = require("Storage");

const unit = require("unit");
// const fetchTime = require('now');

let log = console.log;

let startTime = new Date();

const err_blinks = {
    badconf: 5,
    wifidis: 4
};

// Blue led blinking routine
const blink = (num, delay) => {
    if (num > 0) {
        digitalWrite(D2, 1);
        setTimeout(() => {
            digitalWrite(D2, 0);
            setTimeout(() => { blink(num-1, delay); }, delay);
        }, delay);
    }
};

// Read connection data from the storage
const netconf = storage.readJSON("network.json");
// const unitconf = storage.readJSON("unit.json");
const jobconf = storage.readJSON("job.json");

//log("network.json", netconf);
//log("unit.json", unitconf);
//log("job.json", jobconf);

if (!netconf) {
    log("No WiFi configuration found. Please create it in the storage with the name network.json");
    blink(err_blinks.badconf, 500);
} else {

    // if (!unitconf) {
    //     log("No Unit configuration found. Please create it in the storage with the name network.json");
    //     storage.writeJSON(unit.json, {
    //         name: 'unknown-unit',
    //         location: 'unknown-location'
    //     });
    // }
    //
    // const devs = unitconf.devs.reduce((devs, dev) => {
    //     switch (dev.type) {
    //         case 'relay':
    //             log("Initialize new Relay " + dev.name + ' on port ' + dev.pin);
    //             devs[dev.name] = new RelayPort(dev, ()=>1);
    //             if (dev.default) {
    //                 devs[dev.name].on();
    //             } else {
    //                 devs[dev.name].off();
    //             }
    //             break;
    //         case 'onewire':
    //             log("Initialize new 1-wire bus on port " + dev.pin);
    //             devs[dev.name] = new OneWirePort(dev, unitconf.onewire);
    //             break;
    //         default:
    //             log("Ignore unknown dev type: " + dev.type);
    //     }
    //     return devs;
    // }, {});
    //
    // log("Unit devices", Object.keys(devs));
    //
    //
    // //const dallasTemps = devs.onewire ? devs.onewire.dallasTemps : [];
    // log("1-wire IDs", devs.onewire.ids);
    // // log("Dallas temp sensors", dallasTemp);


    let wifion = false;
    wifi.on('connected', (details) => {
        log("WiFi connected!", details);
        wifion = true;
    });
    wifi.on('disconnected', (details) => {
        blink(err_blinks.wifidis, 500);
        log("WiFi disconnected!", details);
        wifion = false;
    });

    // Connect Wifi
    const connectWiFi = () => {
        log('WiFi connecting ' + netconf.wifi.ssid + ' ...');

        wifi.connect(netconf.wifi.ssid, netconf.wifi, (err) => {
            if (err) {
                log('WiFi connect error: ' + err);
                return;
            }

            log('WiFi successfully connected!');

            // Ajust network time
            require('now').ajustTime(netconf.time.server, netconf.time.utc_offset, (date) => {
                log('Current time is ', new Date());
                startTime = date;
            });

            // Set MQTT dispatcher
            const Dispatcher = require('dispatcher.mqtt');
            const mqtt = new Dispatcher(unit.name, netconf.mqtt);
            // const mqtt = require('dispatcher.mqtt').create(unitconf.name, netconf.mqtt, {onIn: () => blink(2, 50), onOut: () => blink(1, 150),);


            // Connect MQTT
            log('MQTT connecting ' + netconf.mqtt.host + ':' + netconf.mqtt.options.port + ' ...');

            mqtt.connect(() => {
                log('MQTT successfully connected!');

                mqtt.client.on('message', () => blink(2, 50));
                mqtt.client.on('publish', () => blink(1, 150));

                //      mqtt.pub(unit.topic + 'state', [unitname + ' is ready', new Date()]);
                mqtt.pub(unit.topic + 'state', 'start');

                mqtt.sub(unit.topic + 'job/run', (job) => {
                    log('JOB recieved', job);
                    worker.run(job, true, 'from mqtt');
                });

                mqtt.sub(unit.topic + 'conf/unit/get', () => {
                    log('unit conf request recieved');
                    mqtt.pub(unit.topic + 'conf/unit', unit.conf);
                });
                mqtt.sub(unit.topic + 'conf/job/get', () => {
                    log('job conf request recieved');
                    mqtt.pub(unit.topic + 'conf/job', job.conf);
                });
                mqtt.sub(unit.topic + 'conf/1wire/get', () => {
                    log('onewire request recieved');
                    const items = unit.devs.onewire.dallasTemps.map((item) => {
                        return {
                            id: item.id,
                            params: item.params,
                            value: item.value
                        };
                    });
                    mqtt.pub(unit.topic + 'conf/1wire', items);
                });
                mqtt.sub(unit.topic + 'test', function(data) {
                    log('recieved MQTT', data);
                });

                if (unit.devs.onewire && unit.devs.onewire.dallasTemps) {
                    // Periodically sends temperature to server
                    unit.devs.onewire.dallasTemps.forEach((item) => {
                        if (item.name) {
                            //log('Configure send loop for ', item);
                            item.sendLoop(() => mqtt.pub(unit.topic + 'dev/' + item.name, item.value) )
                        }
                    });
                }
            });
        });
    };


    if (!netconf.ap) {
        // Stop WiFi AP
        wifi.stopAP(() => {
            connectWiFi();
        });
    } else {
        // Todo setup WiFi AP
        connectWiFi();
    }

    // Check WiFi and reconnect on lost connection
    setInterval(() => {
        if (!wifion) {
            connectWiFi();
        }
    }, netconf.wifi.time_check * 1000);


}

} catch(e) {
    console.log("Global catch", e);
}




// log('State', ESP32.getState());

