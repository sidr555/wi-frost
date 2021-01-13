import React, { Component } from 'react';
import './App.css';


import mqtt from 'mqtt';


function App() {
    const mqttOpts = {
        username: "wuser",
        clientId: 'b0908853'
    }

    let client  = mqtt.connect('mqtt://192.168.0.41:9001', mqttOpts);
    client.on('connect', function () {
      client.subscribe('wifrost/test', function (err) {
        if (!err) {
          client.publish('wifrost/test', 'Hello mqtt')
        }
      })
    })

    client.on('message', function (topic, message) {
      // message is Buffer
      console.log(message.toString())
//      client.end()
    });

    return (
       <div>Test</div>
    );
}

export default App;

