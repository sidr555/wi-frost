import React from 'react';
import './App.css';

//import mqtt from 'mqtt';

import config from './config';
import Dispatcher from './dispatcher.mqtt'


let mqtt = Dispatcher.create('mqtt', {
    host: config.mqtt.host,
    options: config.mqtt.options
});

mqtt.connect(() => {
    console.log("Mqtt connected")

    mqtt.sub(config.location + '/ping', function (data) {
        mqtt.pub(config.location + '/pong', 1)
    });

    mqtt.sub(config.location + '/test', function (data) {
        console.log("test >>", data);
    });

    mqtt.sub(config.location + '/log', function (data) {
        console.log("log >>", data);
    });

    mqtt.pub(config.location + '/log', 'UI connected');
})





//
//let client  = mqtt.connect(config.mqtt.host, config.mqtt.options);
//
//client.on('disconnect', function () {
////      client.subscribe(config.location + '/kitchen/freezer/job', function (err) {
//
//  console.log('client disconnected');
//});
//
//client.on('connect', function () {
////      client.subscribe(config.location + '/kitchen/freezer/job', function (err) {
//
//  console.log('client connected');
//
//
//  client.subscribe(config.location + '/test', (err, granted) => {
//      console.log(config.location + '/test subscribed');
//  });
//
//  client.subscribe(config.location + '/ping', function (err) {
//      console.log(config.location + '/ping');
//    if (!err) {
//      client.publish(config.location + '/pong', 1)
//    }
//  })
//})
//
//client.on('message', function (topic, message) {
//  // message is Buffer
//  console.log('MQTT>>', topic, message.toString())
////      client.end()
//});


function App() {

//    console.log('disp', disp);

//
//

    return (
       <div>Test</div>
    );
}

export default App;

