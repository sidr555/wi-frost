import React from 'react';

import { Connector } from 'mqtt-react-hooks';
import Status from './Status';

export default function App() {

    const mqttOpts = {
        username: "wuser",
        clientId: 'b0908853'
    }

  return (
//    <Connector brokerUrl="mqtt://test.mosquitto.org:8080">
//    <Connector brokerUrl="mqtt://192.168.0.41:9001" options={ mqttOpts }>
    <Connector brokerUrl="mqtt://192.168.0.41:9001" options={ mqttOpts }>
        <Status />
    </Connector>
  );
}
