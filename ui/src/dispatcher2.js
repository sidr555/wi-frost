// Use Dispatcher to connect and handle messages (like WebSocket or MQTT)
import mqtt from 'mqtt'

class Dispatcher {
    subsriptions = {}
    wait_pubs = []
    isConnected = false
    isInitialized = false
    timeReconnect = 3000
    client = null

    constructor (name, params) {
//        console.log(name, ">> create new dispatcher")
        this.name = name
        this.params = params
    }

    connect(next) {
//        console.log("dispatcher.mqtt>> connect", this.isConnected, typeof next)
        if (!this.isConnected) {
            this.client = mqtt.connect(this.params.host, this.params.options);

            this.client.on('connect', () => {
//              console.log("dispatcher.mqtt this.isConnected>>", typeof next);
                if (!this.isConnected) {
                    this.isConnected = true;
                    this.timeReconnect = 3000;


                    if (this.isInitialized) return;
//                    console.log("dispatcher.mqtt>> init")

                    this.client.on('disconnect', () => {
                        console.log('dispatcher.mqtt', 'closed');
//                        setTimeout(this.client.connect, this.timeReconnect);

                        if (this.subsriptions.close) {
                            this.subsriptions.close();
                        }
                        this.isConnected = false;

                        if (this.timeReconnect < 60000) {
                            this.timeReconnect *= 2;
                        }
                    });

                    this.client.on('error', (err) => {
                        console.log('dispatcher.mqtt>> error', err);
                    });

                    this.client.on('message', (topic, data) => {
                        // TODO prevent JS injection!
//                        console.log("dispatcher.mqtt message", topic, data, typeof data);
                        data = data.toString();
                        if (data && (data[0] === "[" || data[0] === "{")) {
                            data = JSON.parse(data);
                        }
    //                    console.log("dispatcher.mqtt handle data", topic, data);
                        if (this.subsriptions[topic]) {
                //          console.log(name, ">> run handler", topic);
                            return typeof data === "undefined" ? this.subsriptions[topic]() : this.subsriptions[topic](data);
                        }
                    });

//                this.client.on('packetreceive', (packet) => {
//                    console.log("dispatcher.mqtt packetreceive", packet);
//                });

                    this.client.on('error', (err) => {
                        console.log("dispatcher.mqtt error", err);
                    });

                    this.isInitialized = true;

                    // subscribe all listeners added before mqtt was connected
                    Object.keys(this.subsriptions).forEach((topic) => this.clientSub(topic, this.subsriptions[topic]))

                    // publish all waiting messages
                    this.wait_pubs.forEach(({topic, data}) => this.pub(topic, data))
                    this.wait_pubs = []

                    if (typeof next === "function") {
                        next(this.client);
                    }

                }
            });
        }
    }


    pub(topic, data, params) {
        console.log("pub", topic, data, params);
        if (!this.isConnected) {
            if (params.wait_connect) {
                this.wait_pubs.push({topic, data});
            }
            return;
        }
        if (typeof data === "object") {
            data = JSON.stringify(data);
        }
        this.client.publish(topic, data);
    };

    sub(topic, next) {
//      console.log(name, ">> subscribe topic", topic, typeof next);
        this.subsriptions[topic] = next;
        this.clientSub(topic);
    }

    clientSub(topic) {
        if (!this.isConnected) return;
//        console.log("dispatcher.mqtt>> sub", topic, this.isConnected);
        this.client.subscribe(topic);
    }

}

Dispatcher.create = (name, params) => new Dispatcher(name, params);


export default Dispatcher;
