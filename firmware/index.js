const Wifi = require('Wifi');
const storage = require("Storage");
const RelayPort = require('relay');
const OneWirePort = require('1wire');

let log = console.log;

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
const unitconf = storage.readJSON("unit.json");
const jobconf = storage.readJSON("job.json");

//log("network.json", netconf);
//log("unit.json", unitconf);
//log("job.json", jobconf);

if (!netconf) {
    log("No WiFi configuration found. Please create it in the storage with the name network.json");
    blink(err_blinks.badconf, 500);
} else {

    if (!unitconf) {
        log("No Unit configuration found. Please create it in the storage with the name network.json");
        storage.writeJSON(unit.json, {
            name: 'unknown-unit',
            location: 'unknown-location'
        });
    }

    const devs = unitconf.devs.reduce((devs, dev) => {
        switch (dev.type) {
            case 'relay':
                log("Initialize new Relay " + dev.name + ' on port ' + dev.pin);
                devs[dev.name] = new RelayPort(dev, ()=>1);
                if (dev.default) {
                    devs[dev.name].on();
                } else {
                    devs[dev.name].off();
                }
                break;
            case 'onewire':
                log("Initialize new 1-wire bus on port " + dev.pin);
                devs[dev.name] = new OneWirePort(dev, unitconf.onewire);
                break;
            default:
                log("Ignore unknown dev type: " + dev.type);
        }
        return devs;
    }, {});

    log("Unit devices", Object.keys(devs));


    const dallasTemps = devs.onewire ? devs.onewire.dallasTemps : [];
    log("1-wire IDs", devs.onewire.ids);
    // log("Dallas temp sensors", dallasTemp);

    const Dispatcher = require('dispatcher.mqtt');
    const mqtt = new Dispatcher(unitconf.name, netconf.mqtt);
    // const mqtt = require('dispatcher.mqtt').create(unitconf.name, netconf.mqtt, {
    //         onIn: () => blink(2, 50),
    //         onOut: () => blink(1, 150),
    //     });
    // Set MQTT dispatcher

    const topic = (name) => [unitconf.location, unitconf.name, name].join('/');
    // let tempMap = {
    //   '284d341104000093': 'moroz',
    //   '28bf19110400009b': 'body'
    // };


    let wifion = false;
    Wifi.on('connected', (details) => {
        log("WiFi connected!", details);
        wifion = true;
    });
    Wifi.on('disconnected', (details) => {
        blink(err_blinks.wifidis, 500);
        log("WiFi disconnected!", details);
        wifion = false;
    });

    // Connect Wifi
    const connectWiFi = () => {
        log('WiFi connecting ' + netconf.wifi.ssid + ' ...');

        Wifi.connect(netconf.wifi.ssid, netconf.wifi, (err) => {
            if (err) {
                log('WiFi connect error: ' + err);
                return;
            }

            log('WiFi successfully connected!');

            // Connect MQTT
            log('MQTT connecting ' + netconf.mqtt.host + ':' + netconf.mqtt.options.port + ' ...');

            mqtt.connect(() => {
                log('MQTT successfully connected!');

                mqtt.client.on('message', () => blink(2, 50));
                mqtt.client.on('publish', () => blink(1, 150));


                //      mqtt.pub(topic('state'), [unitconf.name + ' is ready', new Date()]);
                mqtt.pub(topic('state'), 'start');

                mqtt.sub(topic('run'), (job) => {
                    log('JOB recieved', job);
                    worker.run(job, true, 'from mqtt');
                });

                mqtt.sub(topic('need_conf'), () => {
                    log('unitconf request recieved');

                    mqtt.pub(topic('unitconf'), unitconf);
                    mqtt.pub(topic('jobconf'), jobconf);
                });

                mqtt.sub(topic('test'), function(data) {
                    log('recieved MQTT', data);
                });

                if (devs.onewire && devs.onewire.dallasTemps && unitconf.onewire.send_time) {
                    // Periodically sends temperature to server
                    setInterval(() => {
                        // log('Send temps', dallasTemp);
                        dallasTemp.forEach((item) => {
                            if (item.name) {
                                mqtt.pub(topic('temp/' + item.name), item.temp);
                            }
                        });
                    }, unitconf.onewire.send_time * 1000);
                }
            });
        });
    };


    if (!netconf.ap) {
        // Stop WiFi AP
        Wifi.stopAP(() => {
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


// log('State', ESP32.getState());

