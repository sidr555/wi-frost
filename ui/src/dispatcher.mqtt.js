// MQTT dispatcher
import mqtt from 'mqtt'

let mqttdisp = {
    create: function(name, params) {
    console.log("create dispatcher", name, params);
        let connected = false,
            inited = false,
            rectime = 3000;
        let client = null;
        // console.log("dispatcher.mqtt>> create", client)

//        params.options.transformWsUrl = (url, options, client) => {
//          console.log("transformWsUrl");
//          client.options.username = `token=${this.get_current_auth_token()}`;
//          client.options.clientId = `${this.get_updated_clientId()}`;
//          return `${this.get_signed_cloud_url(url)}`;
//        }


        let dispatcher =  require("./dispatcher").create((name || "mqtt_client"), {
            connect: (next) => {
                console.log("dispatcher.mqtt>> connect", client, connected, typeof next)
                if (!connected) {
                    client = mqtt.connect(params.host, params.options);
                    window.cll = client;
                    client.on('connect', () => {
//                        console.log("dispatcher.mqtt connected>>", typeof next);
                        if (!connected) {
                            connected = true;
                            rectime = 3000;
                            if(typeof next === "function") {
                                next(client);
                            }
                        }
                    });
                }
            },
            init: (handle) => {
                if (inited) return;
                console.log("dispatcher.mqtt>> init", typeof handle)
                client.on('disconnect', () => {
                    console.log('dispatcher.mqtt', 'closed');
                    setTimeout(client.connect, rectime);
                    if (rectime < 60000) rectime *= 2;
                    handle("close");
                    connected = false;
                   //client = null;
                });

                client.on('error', (err) => {
                    console.log('dispatcher.mqtt>> error', err);
                });

                client.on('message', (topic, data) => {
                    // TODO prevent JS injection!
//                    console.log("dispatcher.mqtt message", typeof data, topic, data);
                    data = data.toString();
                    if (data && (data[0] === "[" || data[0] === "{")) {
                        data = JSON.parse(data);
                    }
//                    console.log("dispatcher.mqtt handle data", topic, data);
                    handle(topic, data);
                });

//                client.on('packetreceive', (packet) => {
//                    console.log("dispatcher.mqtt packetreceive", packet);
//                });

                client.on('error', (err) => {
                    console.log("dispatcher.mqtt error", err);
                });

                inited = true;
            },
            pub: (topic, data) => {
                if (!connected) return;
                if (typeof data === "object") {
                    data = JSON.stringify(data);
                }
                client.publish(topic, data);
            },
            sub: (topic, handle) => {
//                console.log("dispatcher.mqtt>> sub", topic, connected);
                if (!connected) return;
                client.subscribe(topic);
            }
        });

        return dispatcher;
    }
};

export default mqttdisp;
