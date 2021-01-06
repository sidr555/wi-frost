// Use Dispatcher to connect and handle WebSocket messages
module.exports = function() {
    let ws = null;
    let lst = {};

    this.on = (e, l) => lst[e] = l;

    this.connect = (fn) => {
        if (typeof fn === "function") {
            this.con = fn;
        }
        if (typeof this.con === "function") {
            this.con((w) => {
                // console.log("reinit WS")
                ws = w;
                ws.on('open', () => {
                    console.log("WS connected");
                    this.handle("connect");
                });

                ws.on('close', () => {
                    console.log('WS closed');
                    ws = null;
                    this.handle("close");
                });

                ws.on('error', (err) => {
                    console.log('WS error', err);
                    this.handle("error", err);
                })

                ws.on('message', (msg) => {
                    // TODO prevent JS injection!
                    let arr = JSON.parse(msg);
                    this.handle(arr[0], arr[1]);
                });
            });
        }
    }

    this.send = (e, obj) => {
        if (ws) {
            // console.log("WS send", e, obj)
            ws.send(JSON.stringify([e, obj || ""]));
        } else {
            // console.log("WS cannot send")
        }
    };

    this.handle = (e, obj) => {
        if (typeof lst[e] === "function") {
            return typeof obj === "undefined" ? lst[e]() : lst[e](obj);
        }
    }
}


