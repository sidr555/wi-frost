// MQTT dispatcher
module.exports = {
    create: function(name, params) {
        let host = params.host;
        let connected = false;
        let rectime = 3000;

        params.host = null;
        let mqtt = require("tinyMQTT").create(host, params);
        // console.log("dispetcher.mqtt>> create", mqtt)

        let dispetcher =  require("dispatcher").create((name || "mqtt_client"), {
            connect: (next) => {
                if (!connected) {
                    // console.log("dispatcher.mqtt>> ", "connect", mqtt)
                    mqtt.connect();
                    mqtt.on('connected', () => {
                        // console.log("dispetcher.mqtt connected>>", typeof next);
                        connected = true;
                        rectime = 3000;
                        if(typeof next === "function") {
                            next();
                        }
                    });
                }
            },
            init: (handle) => {
                // console.log("dispatcher.mqtt>> init", typeof handle)
                mqtt.on('disconnected', () => {
                    console.log(dispetcher.mqtt, 'closed');
                    setTimeout(mqtt.connect, rectime);
                    rectime *= 2;
                    handle("close");
                    mqtt = null;
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
            },
            pub: (topic, data) => {
                if (typeof data === "object") {
                    data = JSON.stringify(data);
                }
                mqtt.publish(topic, data);
            },
            sub: (topic, handle) => {
                console.log("dispatcher.mqtt>> sub", topic);
                mqtt.subscribe(topic);
            }
        });

        return dispetcher;
    }
}
