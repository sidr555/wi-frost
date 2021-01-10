// MQTT dispatcher

let Dispatcher = function(name, params) {
    // console.log(name, ">> create new MQTT")
    let lst = {};
    let host = params.host;
    let connected = false,
        inited = false,
        rectime = 3000;
    params.host = null;

    let mqtt = require("tinyMQTT").create(host, params);
    // console.log("dispetcher.mqtt>> create", mqtt)


    this.connect = (next) => {
        // console.log("MQTT dispatcher>> connect", mqtt, connected, typeof next)
        if (!connected) {
            mqtt.connect();
            mqtt.on('connected', () => {
                // console.log("MQTT dispatcher connected>>", typeof next);
                connected = true;
                rectime = 3000;

                if (!inited) {
                    // console.log("MQTT dispatcher>> init", typeof handle)
                    mqtt.on('disconnected', () => {
                        // console.log('dispatcher.mqtt', 'closed');
                        connected = false;
                        setTimeout(mqtt.connect, rectime);
                        if (rectime < 60000) rectime *= 2;
                        lst['close'] && lst['close']();
                    });

                    // mqtt.on('error', (err) => {
                    //     console.log('MQTT dispatcher>> error', err);
                    // });

                    mqtt.on('message', (data) => {
                        // TODO prevent JS injection!
                        // console.log("dispetcher.mqtt message", typeof data, data.topic, data);
                        if (data.message && (data.message[0] == "[" || data.message[0] == "{")) {
                            data.message = JSON.parse(data.message);
                        }
                        // console.log("dispetcher.mqtt handle data", data.topic, data.message);
                        lst[data.topic] && lst[data.topic](data.message)
                    });

                    inited = true;
                }

                if(typeof next === "function") {
                    next();
                }
            });
        }

        if (typeof params.connect === "function") {
            params.connect(() => {
                if (typeof params.init === "function") {
                    params.init((topic, data) => {
                        // console.log(name, ">> looking for handler", topic, typeof lst[topic], lst);
                        if (typeof lst[topic] === "function") {
                            // console.log(name, ">> run handler", topic);
                            return typeof data === "undefined" ? lst[topic]() : lst[topic](data);
                        }
                    });

                    // console.log(name, ">> connected");

                    if (typeof next === "function") {
                        next();
                    }
                }
            });
        }
    }

    this.pub = (topic, data) => {
        if (!connected) return;
        if (typeof data === "object") {
            data = JSON.stringify(data);
        }
        mqtt.publish(topic, data);
    };

    this.sub = (topic, next) => {
        if (!connected) return;
        // console.log("MQTT dispatcher>> sub", topic);
        mqtt.subscribe(topic);
        if (typeof next === "function") {
            // console.log(name, ">> subscribe topic", topic, typeof next);
            lst[topic] = next;
        }
    }
}

// Dispatcher.create = (name, params) => new Dispatcher(name, params);

module.exports = Dispatcher;
