// Use Dispatcher to connect and handle messages (like WebSocket or MQTT)
let Dispatcher = function(name, params) {
    console.log(name, ">> create new dispatcher")
    let lst = {};

    this.connect = (next) => {
        console.log("dispatcher>> connect");
        if (typeof params.connect === "function") {
            params.connect((client) => {
                if (typeof params.init === "function") {
                    params.init((topic, data) => {
                        console.log(name, ">> looking for handler", topic, typeof lst[topic], lst);
                        if (typeof lst[topic] === "function") {
//                            console.log(name, ">> run handler", topic);
                            return typeof data === "undefined" ? lst[topic]() : lst[topic](data);
                        }
                    });

                    // subscribe all listeners added before mqtt was connected
                    if (typeof params.sub === "function") {
                        Object.keys(lst).forEach((topic) => params.sub(topic, lst[topic]));
                    }

                    if (typeof next === "function") {
                        next(client);
                    }
                }
            });
        }
    }

    this.pub = (topic, data) => {
        if (typeof params.pub === "function") {
            // console.log(name, ">> publish message", topic, data);
            params.pub(topic, data)
        } else {
            // console.log("WS cannot send")
        }
    };

    this.sub = (topic, next) => {
        if (typeof params.sub === "function" && typeof next === "function") {
//            console.log(name, ">> subscribe topic", topic, typeof next);
            params.sub(topic);
            lst[topic] = next;
        }
    }
}

Dispatcher.create = (name, params) => new Dispatcher(name, params);


module.exports = Dispatcher;
