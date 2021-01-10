// MQTT dispatcher
module.exports = {
    create: function(name, params) {
        let host = params.host;
        let connected = false,
            inited = false,
            rectime = 3000;

        params.host = null;
        let mqtt = require("tinyMQTT").create(host, params);
        // console.log("dispetcher.mqtt>> create", mqtt)

        let dispetcher =  require("dispatcher").create((name || "mqtt_client"), {
            connect: (next) => {
                console.log("dispatcher.mqtt>> connect", mqtt, connected, typeof next)
                if (!connected) {
                    mqtt.connect();
                    mqtt.on('connected', () => {
                        console.log("dispatcher.mqtt connected>>", typeof next);
                        connected = true;
                        rectime = 3000;
                        if(typeof next === "function") {
                            next();
                        }
                    });
                }
            },
            init: (handle) => {
                if (inited) return;
                console.log("dispatcher.mqtt>> init", typeof handle)
                mqtt.on('disconnected', () => {
                    console.log('dispatcher.mqtt', 'closed');
                    setTimeout(mqtt.connect, rectime);
                    if (rectime < 60000) rectime *= 2;
                    handle("close");
                    connected = false;
                   //mqtt = null;
                });

                mqtt.on('error', (err) => {
                    console.log('dispatcher.mqtt>> error', err);
                });

                mqtt.on('message', (data) => {
                    // TODO prevent JS injection!
                    // console.log("dispetcher.mqtt message", typeof data, data.topic, data);
                    if (data.message && (data.message[0] == "[" || data.message[0] == "{")) {
                        data.message = JSON.parse(data.message);
                    }
                    // console.log("dispetcher.mqtt handle data", data.topic, data.message);
                    handle(data.topic, data.message);
                });

                inited = true;
            },
            pub: (topic, data) => {
                if (!connected) return;
                if (typeof data === "object") {
                    data = JSON.stringify(data);
                }
                mqtt.publish(topic, data);
            },
            sub: (topic, handle) => {
                if (!connected) return;
                console.log("dispatcher.mqtt>> sub", topic);
                mqtt.subscribe(topic);
            }
        });

        return dispetcher;
    }
}
