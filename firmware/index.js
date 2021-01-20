const conf = require('config');
let log = console.log;

// Initialize DS18B20 temperature sensors and send statistics via WebSockets
const ow = new OneWire(conf.ow.pin);
let sensors = ow.search().map(function (id) {
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
  setInterval(obj.check, conf.ow.tCheck * 1000);
  return obj;
}, {});

const topic = (name) => [conf.place, conf.device, name].join('/');



let tempMap = {
  '284d341104000093': 'moroz',
  '28bf19110400009b': 'body'
};

const blink = (num, delay) => {
    if (num > 0) {
        digitalWrite(D2, 1);
        setTimeout(() => {
            digitalWrite(D2, 0);
            setTimeout(() => { blink(num-1, delay); }, delay);
        }, delay);
    }
};

//blink(4, 150);


let disp = require('dispatcher.tinymqtt')
    .create(conf.device, conf.mqtt, {
        onIn: () => blink(2, 50),
        onOut: () => blink(1, 150),
    });

console.log('WiFi connection ', conf.wifi.ssid, conf.wifi);
require('Wifi').connect(conf.wifi.ssid, conf.wifi, (err) => {
  console.log('WiFi connect error: ' + err);

  if (!err) {
    console.log('WiFi connected: ' + conf.wifi.ssid);

    disp.connect(() => {
      console.log('MQTT connected: ' + conf.mqtt.host + ':' + conf.mqtt.port);

      disp.pub(topic('state'), [conf.device + ' is ready', new Date()]);

      disp.sub(topic('run'), (job) => {
        console.log('JOB recieved', job);
        worker.run(job, true, 'from mqtt');
      });

        disp.sub(topic('test'), function(data) {
          log('recieved MQTT', data);
        });


      // Periodically sends temperature to server
      setInterval(() => {
        // console.log('Send temps', sensors);
        sensors.forEach((obj) => {
          if (obj.temp) {
            if (tempMap[obj.id]) {
              disp.pub(topic('temp/' + tempMap[obj.id]), [obj.temp]);
              console.log('send wi-frost/temp/' + tempMap[obj.id], obj.id, obj.temp);
            } else {
              disp.pub(topic('temp/other'), [obj.id, obj.temp]);
              console.log('send wi-frost/temp/other', [obj.id, obj.temp]);
            }
          }
        });
        // disp.pub('wi-frost/temp', temp);
      }, conf.ow.tSend * 1000);

    });
  }
});







let now = require('now').Now;
let secFrom = require('now').Sec;
let Relay = require('relay');

let compressor = new Relay('Compressor', conf.relays.compr, (on) => {
  return true;
  // return !on || secFrom(this.time) > conf.lims.compr_sleeptime
});

let heater = new Relay('Heater', conf.relays.heater, (on) => {
  return true;
  // return on || secFrom(this.time) > conf.lims.heater_stop_minutes
});

let compressorFan = new Relay('Compressor Fan', conf.relays.comprFan, (on) => {
  return true;
  // return !on || secFrom(this.time) > conf.lims.compr_sleeptime
});



let worker = {
  job: 'off',

  sleep:  (force) => compressor.off(force) && heater.off(true),
  heat:   (force) => compressor.off(force) && heater.on(force),
  freeze: (force) => heater.off(force) && compressor.on(force),
  start: () => {},

  run: (job, force, reason) => {
    // log('worker run job', job, force);
    if (job !== worker.job &&
        typeof worker[job] === 'function' &&
        worker[job](force)) {

      worker.job = job;
      log('worker job started', worker.job, ' compressor:', compressor.act ? '+' : '-', 'heater:', heater.act ? '+' : '-');
      // ws.send('job', job);

      if (reason) {
        // ws.send('log', reason);
      }
    }
  },

  loop: () => {
    if (!conf.lims) return;

    let time = now(),
        hour = (new Date()).getHours(),
        // temp = Object.keys(conf.sensors).reduce((obj, key) => {
        //   // console.log('temp', key, conf.sensors[key], sensors[conf.sensors[key]]);
        //   obj[key] = sensors[conf.sensors[key]] ? sensors[conf.sensors[key]].temp : false;
        //   return obj;
        // }, {});
        temp = {};

    log('JOB LOOP', worker.job, hour, temp);

    // Start heater on time
    if (worker.job !== 'heat' && hour === conf.lims.heater_start_hour) {
      // log('START HEATER ON TIME')
      return worker.run('heat', false, ['heater_start_hour', hour]);
    }

    // Stop heater on time
    if (worker.job === 'heat' && secFrom(this.heater.time) > conf.lims.heater_stop_minutes * 60) {
      // log('STOP HEATER ON TIME')
      return worker.run('sleep', false,['heater_stop_minutes', hour]);
    }

    // Stop freezing on moroz temp < stop temp
    if (worker.job === 'freeze' && temp.moroz && temp.moroz < conf.lims.moroz_stop_temp) {
      // log('STOP COMPRESSOR (GOOD MOROZ)')
      return worker.run('sleep', ['moroz_stop_temp', temp.moroz]);
    }

    // Start freezing on moroz temp > start temp
    if (worker.job !== 'freeze' &&
        temp.moroz && temp.moroz > conf.lims.moroz_start_temp) {
      // log('START COMPRESSOR (LOW MOROZ)')
      return worker.run('freeze', ['moroz_start_temp', temp.moroz]);
    }

    // Stop freezing on compressor temp > max temp
    if (worker.job === 'freeze' &&
        temp.compr && temp.compr > conf.lims.compr_max_temp) {
      // log('STOP COMPRESSOR (HIGH TEMP)')
      return worker.run('sleep', ['compr_max_temp', temp.compr]);
    }

    // Warn on unit temp > max temp
    if (temp.unit && temp.unit > conf.lims.unit_max_temp) {
      // log('HIGH UNIT TEMP')
      // ws.send('warn', ['unit_max_temp', temp.unit]);
    }

    // Start heater on delta temp
    if (worker.job !== 'heat' &&
        temp.body - temp.moroz > conf.lims.delta_temp) {
      // log('START HEATER (GOOD MOROZ AND LOW BODY TEMP)')
      return worker.run('heat', ['delta_temp', temp.moroz, temp.body]);
    }
  }
};


// worker.run('start');
setTimeout(() => worker.run('freeze'), 2000);
setTimeout(() => worker.run('heat'), 5000);
//
//setInterval(worker.loop, conf.job.tLoop * 1000);


// let esp = require('ESP8266');
// log('Free flash', esp.getFreeFlash());
// esp.setCPUFreq(160);
// log('State', esp.getState());


