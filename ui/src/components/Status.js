import React from 'react';

import { useMqttState } from 'mqtt-react-hooks';

console.log("state", useMqttState);
export default function Status() {

  /*
  * Status list
  * - offline
  * - connected
  * - reconnecting
  * - closed
  */
  const client = useMqttState();

    console.log("status", client.connectionStatus);

    function handleClick (msg) {
        client.publish("wifrost/test", msg + " +++ ");
    }

  return (
    <div>
        <h1>Status: { client.connectionStatus }</h1>
        <button type="button" onClick={() => handleClick('test')}>
          Disable led
        </button>
    </div>
  );
}
