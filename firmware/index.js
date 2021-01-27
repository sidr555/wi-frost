try {

    const wifi = require('Wifi');
    const storage = require('Storage');
    const blinker = require('blinker');
    const Unit = require('unit');
    const Worker = require('worker');

    let log = console.log;
    let startTime = new Date();

    try {
        const unit = new Unit();
        const worker = new Worker(unit);
        worker.build();
    } catch(e) {
        console.log('Cannot construct base features, exit', e);
        blinker(5);
    }



    // Read connection data from the storage
    const netconf = storage.readJSON('network.json');
    if (!netconf) {
        log('No WiFi configuration found. Please create it in the storage with the name network.json');
        blinker(5);
    } else {

        let wifion = false;
        wifi.on('connected', (details) => {
            log('WiFi connected!', details);
            wifion = true;
        });
        wifi.on('disconnected', (details) => {
            blinker(3, 500);
            log('WiFi disconnected!', details);
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

                    mqtt.client.on('message', () => blinker(2, 50));
                    mqtt.client.on('publish', () => blinker(1, 150));

                    //      mqtt.pub(unit.topic + 'state', [unitname + ' is ready', new Date()]);
                    mqtt.pub(unit.topic + 'hello');

                    worker.useMQTT(mqtt);
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
    console.log('Global catch', e);
}

// log('State', ESP32.getState());

