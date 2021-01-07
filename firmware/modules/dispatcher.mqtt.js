// Use Dispatcher to connect and handle messages (like WebSocket or MQTT)
module.exports = {
    create: function(name, params) {
        let host = params.host;
        params.host = null;
        let mqtt = require("tinyMQTT").create(host, params);
        // console.log("dispetcher.mqtt>> create", mqtt)

        let dispetcher =  require("dispatcher").create((name || "mqtt_client"), {
            connect: (next) => {
                // console.log("dispatcher.mqtt>> ", "connect", mqtt)
                mqtt.connect();
                mqtt.on('connected', () => {
                    // console.log("dispetcher.mqtt connected>>", typeof next);
                    if(typeof next === "function") {
                        next();
                    }
                });
            },
            init: (handle) => {
                // console.log("dispatcher.mqtt>> init", typeof handle)
                mqtt.on('disconnected', () => {
                    // console.log(dispetcher.mqtt, 'closed');
                    setTimeout(mqtt.connect, 3000); // TODO exp time
                    handle("close");
                    mqtt = null;
                });

                mqtt.on('message', (msg) => {
                    // TODO prevent JS injection!
                    // console.log("dispetcher.mqtt mess");
                    if (msg.data) {
                        msg.data = JSON.parse(msg.data);
                        handle(msg.topic, msg.data);
                    } else {
                        handle(msg.topic);
                    }
                });
            },
            pub: (topic, data) => {
                if (typeof data === "object") {
                    data = JSON.stringify(data);
                }
                mqtt.publish(topic, data);
            },
            sub: (topic, handle) => {
                // console.log("dispatcher.mqtt>> sub", topic);
                mqtt.subscribe(topic);
            }
        });

        return dispetcher;
    }
}
