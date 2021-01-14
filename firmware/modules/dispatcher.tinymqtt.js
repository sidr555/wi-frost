// tinyMQTT dispatcher
module.exports = {
    create: function(name, params) {
        let host = params.host;
        let connected = false,
            inited = false,
            rectime = 3000;

        params.host = null;
        let client = require("tinyMQTT").create(host, params);
        // console.log("dispatcher.client>> create", client)

        let dispatcher =  require("dispatcher").create((name || "client_client"), {
            connect: (next) => {
                console.log("dispatcher.tinymqtt>> connect", client, connected, typeof next)
                if (!connected) {
                    client.connect();
                    client.on('connected', () => {
                        console.log("dispatcher.tinymqtt connected>>", typeof next);
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
                console.log("dispatcher.tinymqtt>> init", typeof handle)
                client.on('disconnected', () => {
                    console.log('dispatcher.tinymqtt', 'closed');
                    setTimeout(client.connect, rectime);
                    if (rectime < 60000) rectime *= 2;
                    handle("close");
                    connected = false;
                   //client = null;
                });

                client.on('error', (err) => {
                    console.log('dispatcher.tinymqtt>> error', err);
                });

                client.on('message', (data) => {
                    // TODO prevent JS injection!
                    // console.log("dispatcher.client message", typeof data, data.topic, data);
                    if (data.message && (data.message[0] == "[" || data.message[0] == "{")) {
                        data.message = JSON.parse(data.message);
                    }
                    // console.log("dispatcher.client handle data", data.topic, data.message);
                    handle(data.topic, data.message);
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
                if (!connected) return;
                console.log("dispatcher.tinymqtt>> sub", topic);
                client.subscribe(topic);
            }
        });

        return dispatcher;
    }
}
