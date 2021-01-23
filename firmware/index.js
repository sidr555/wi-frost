const Wifi = require('Wifi');
const storage = require("Storage");
//const conf = require('config');
let log = console.log;

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

log("network.json", netconf);
//log("unit.json", unitconf);
//log("job.json", jobconf);

if (!netconf) {
    log("No WiFi configuration found. Please create it in the storage with the name network.json");
    blink(5, 500);
} else {

    if (!unitconf) {
        log("No Unit configuration found. Please create it in the storage with the name network.json");
        storage.writeJSON(unit.json, {
            name: 'unknown-unit',
            location: 'unknown-location'
        });
    }

    const devs = unitconf.devs.map((dev) => {

    });



    let dallasSensors = [];
    if (unitconf.onewire) {
        log("Initialize OneWire", unitconf.onewire);

        // Initialize DS18B20 temperature sensors and send statistics via WebSockets
        const ow = new OneWire(unitconf.onewire.pin);
        dallasSensors = ow.search().map(function (id) {
          let dev = require('DS18B20').connect(ow, id);

          let obj = {
            id: id,
            dev: dev,
            check: () => {
              dev.getTemp((temp) => {
                obj.temp = temp;
        //        log('Check temp', id, temp);
              });
            }
          };
          obj.check();
          setInterval(obj.check, unitconf.onewire.tCheck * 1000);
          return obj;
        }, {});
    }



    // Set MQTT dispatcher
    const disp = require('dispatcher.tinymqtt')
        .create(unitconf.name, netconf.mqtt, {
            onIn: () => blink(2, 50),
            onOut: () => blink(1, 150),
        });

    const topic = (name) => [unitconf.location, unitconf.name, name].join('/');
    let tempMap = {
      '284d341104000093': 'moroz',
      '28bf19110400009b': 'body'
    };


    Wifi.on('connected', (details) => log("WiFi connected!", details));
    Wifi.on('disconnected', (details) => log("WiFi disconnected!", details));


    // Connect Wifi
    const connectWiFi = () => {
        console.log('WiFi connecting ' + netconf.wifi.ssid + ' ...');

        Wifi.connect(netconf.wifi.ssid, netconf.wifi, (err) => {
            if (!err) {
                console.log('WiFi connect error: ' + err);
                return;
            }

            console.log('WiFi successfully connected!');

            // Connect MQTT
            console.log('MQTT connecting ' + netconf.mqtt.host + ':' + netconf.mqtt.port + ' ...');

            disp.connect(() => {
                console.log('MQTT successfully connected!');

        //      disp.pub(topic('state'), [unitconf.name + ' is ready', new Date()]);
                disp.pub(topic('state'), 'start');

                disp.sub(topic('run'), (job) => {
                    console.log('JOB recieved', job);
                    worker.run(job, true, 'from mqtt');
                });

                disp.sub(topic('test'), function(data) {
                    log('recieved MQTT', data);
                });

                if (dallasSensors.letgth && unitconf.onewire.send_time) {
                    // Periodically sends temperature to server
                    setInterval(() => {
                        // console.log('Send temps', dallasSensors);
                        dallasSensors.forEach((obj) => {
                            if (obj.temp) {
                                if (tempMap[obj.id]) {
                                    disp.pub(topic('temp/' + tempMap[obj.id]), [obj.temp]);
        //                  console.log('send wi-frost/temp/' + tempMap[obj.id], obj.id, obj.temp);
                                } else {
                                    disp.pub(topic('temp/other'), [obj.id, obj.temp]);
        //                  console.log('send wi-frost/temp/other', [obj.id, obj.temp]);
                                }
                            }
                        });
                        // disp.pub('wi-frost/temp', temp);
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
        log("Check Wifi status");
        Wifi.getStatus((status) => {
            log("Wifi status", status);
    //        if (status.station === "connected") {
    //            log('Wifi status: connected');
    //        } else {
    //            connect();
    //        }
        });
    }, netconf.wifi.check_time * 1000);


}




/*
const now = require('now').Now;
const secFrom = require('now').Sec;
const Relay = require('relay');

const compressor = new Relay('Compressor', unitconf.relays.compr, (on) => {
  return true;
  // return !on || secFrom(this.time) > jobconf.lims.compr_sleeptime
});

const heater = new Relay('Heater', unitconf.relays.heater, (on) => {
  return true;
  // return on || secFrom(this.time) > jobconf.lims.heater_stop_minutes
});

const compressorFan = new Relay('Compressor Fan', unitconf.relays.comprFan, (on) => {
  return true;
  // return !on || secFrom(this.time) > jobconf.lims.compr_sleeptime
});



const worker = {
  job: 'off',

  reboot: () => ESP32.reboot(),
  deep: () => ESP32.deepSleep(10000000),
  sleep:  (force) => compressor.off(force) && heater.off(true),
  heat:   (force) => compressor.off(force) && heater.on(force),
  freeze: (force) => heater.off(force) && compressor.on(force),
  start: () => {},
  state: () => {
    return {
        job: worker.job,
        wifi: true,
        mqtt: true
    };
  },

  run: (job, force, reason) => {
    // log('worker run job', job, force);
    if (job !== worker.job &&
        typeof worker[job] === 'function' &&
        worker[job](force)) {

      worker.job = job;
      log('worker job started', worker.job, ' compressor:', compressor.act ? '+' : '-', 'heater:', heater.act ? '+' : '-');
      disp.pub(topic('state'), job);

      if (reason) {
          disp.pub(topic('log'), reason);
      }
    }
  },

  loop: () => {
    if (!jobconf.lims) return;

    let time = now(),
        hour = (new Date()).getHours(),
        // temp = Object.keys(unitconf.sensors).reduce((obj, key) => {
        //   // console.log('temp', key, unitconf.sensors[key], sensors[unitconf.sensors[key]]);
        //   obj[key] = sensors[unitconf.sensors[key]] ? sensors[unitconf.sensors[key]].temp : false;
        //   return obj;
        // }, {});
        temp = {};

    log('JOB LOOP', worker.job, hour, temp);

    // Start heater on time
    if (worker.job !== 'heat' && hour === jobconf.lims.heater_start_hour) {
      // log('START HEATER ON TIME')
      return worker.run('heat', false, ['heater_start_hour', hour]);
    }

    // Stop heater on time
    if (worker.job === 'heat' && secFrom(this.heater.time) > jobconf.lims.heater_stop_minutes * 60) {
      // log('STOP HEATER ON TIME')
      return worker.run('sleep', false,['heater_stop_minutes', hour]);
    }

    // Stop freezing on moroz temp < stop temp
    if (worker.job === 'freeze' && temp.moroz && temp.moroz < jobconf.lims.moroz_stop_temp) {
      // log('STOP COMPRESSOR (GOOD MOROZ)')
      return worker.run('sleep', ['moroz_stop_temp', temp.moroz]);
    }

    // Start freezing on moroz temp > start temp
    if (worker.job !== 'freeze' &&
        temp.moroz && temp.moroz > jobconf.lims.moroz_start_temp) {
      // log('START COMPRESSOR (LOW MOROZ)')
      return worker.run('freeze', ['moroz_start_temp', temp.moroz]);
    }

    // Stop freezing on compressor temp > max temp
    if (worker.job === 'freeze' &&
        temp.compr && temp.compr > jobconf.lims.compr_max_temp) {
      // log('STOP COMPRESSOR (HIGH TEMP)')
      return worker.run('sleep', ['compr_max_temp', temp.compr]);
    }

    // Warn on unit temp > max temp
    if (temp.unit && temp.unit > jobconf.lims.unit_max_temp) {
      // log('HIGH UNIT TEMP')
      // ws.send('warn', ['unit_max_temp', temp.unit]);
    }

    // Start heater on delta temp
    if (worker.job !== 'heat' &&
        temp.body - temp.moroz > jobconf.lims.delta_temp) {
      // log('START HEATER (GOOD MOROZ AND LOW BODY TEMP)')
      return worker.run('heat', ['delta_temp', temp.moroz, temp.body]);
    }
  }
};


// worker.run('start');
setTimeout(() => worker.run('heat'), 2000);
setTimeout(() => worker.run('freeze'), 5000);
//
//setInterval(worker.loop, jobconf.loop_time * 1000);

*/



//ESP32.enableBLE(false)

// let esp = require('ESP8266');
// log('Free flash', esp.getFreeFlash());
// esp.setCPUFreq(160);
log('State', ESP32.getState());

