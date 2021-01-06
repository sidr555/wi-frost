const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
// const db = require("./redis_client");
// const fs = require("fs");

const Device = require("./device");

const app = express();

let id = "fr530@1";

var corsOptions = {
    // origin: "http://localhost:8081"
    origin: "http://localhost:3000"
};

app.use(cors(corsOptions));
// app.use(cors());

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));


const WSDispatcher = require("./dispatcher");
const WebSocketServer = require('ws').Server;

let socket = new WSDispatcher();
socket.connect((next) => {
    console.log("Start WebSocketServer");
    let wss = new WebSocketServer({
        port: 8051
    });

    wss.on('connection', (ws) => {
        console.log("new socket connected");
        next(ws);
    });
})


let device = new Device(id);
socket.on("config", () => {
    device.getFullConfig((data, err) => {
        // console.log("get full config", err);
        if (!err) {
            socket.send("config", data);
        }
    });
});

socket.on("limits", () => {
    device.getLimits((data, err) => {
        // console.log("get limits", err);
        if (!err) {
            socket.send("limits", data);
        }
    });
});

socket.on("sensors", () => {
    device.getSensors((data, err) => {
        // console.log("get sensors", err, data);
        if (!err) {
            data.moroz = "284d341104000093";
            data.compressor = "28bf19110400009b";
            socket.send("sensors", data);
        }
    });
});

socket.on("temperature", (data) => {
    console.log("get temperature", data);

    let temp = data.reduce((obj, item) => {
      obj[item.type] = parseInt(item.temperature * 10) / 10;
      return obj;
    }, {});

    device.state.upTemp(temp);
});

socket.on("job", (data) => {
    device.state.upJob(data);
});

let log = [];
socket.on("log", (data) => {
    console.log("LOG", data)
    log.push(data);
});

let warn = [];
socket.on("warn", (data) => {
    console.log("WARN", data)
    warn.push(data);
});


//
//
//
// wss.on('connection', (ws) => {
// // wss.on('connection', function connection(ws) {
//     console.log("WS connected");
//     let device = new Device(id);
//
//     // ws.room = [];
//     // ws.send(JSON.stringify(["time", parseInt((new Date()).getTime()/1000)]));
//
//     ws.on('error', function(err) {
//         console.log("WS error", err);
//     })
//
//     ws.on('close', function() {
//         console.log('WS closed')
//     })
//
//     ws.on('message', (message) => {
//         let arr = JSON.parse(message);
//
//         switch(arr[0]) {
//
//         }
//
//
//         // if (typeof listeners[arr[0]] === "function") {
//         //     listeners[arr[0]](arr[1]);
//         // }
//         // console.log("Server got: ", arr[0], arr[1]);
//     });
// });
//
//
//
//
//
//
//
//
//
//
//
//





// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to Wi-Frost application." });
});




app.get("/config", (req, res) => {
    console.log("get config", id);
    let device = new Device(id);
    device.getFullConfig((config, err) => {
        // console.log("index full config", id, config);
        if (err) {
            res.json({error: err});
        } else {
            res.json(config);
        }
    });
});

app.get("/state", (req, res) => {
    console.log("get state", id);
    let device = new Device(id);

    device.state.get((state, err) => {
        console.log("send state", id, state);
        if (err) {
            console.log("ERROR", err)
            res.json({error: err});
        } else {
            res.json(state);
        }
    });
});

app.get("/setjob/:job", (req, res) => {
    console.log("set job from UI", req.params.job);
    socket.send("setjob", req.params.job);
    res.json({});
});




app.get("/upjob/", (req, res) => {
    console.log("up job", req.query);

    let device = new Device(id);

    device.state.upJob(req.query.job, (err) => {
        if (err) {
            res.json({error: err});
        } else {
            res.json({});
        }
    });
});

app.get("/uptemp/", (req, res) => {
    console.log("up temp", req.query);

    let device = new Device(id);

    device.state.upTemp(req.query, (err) => {
        if (err) {
            res.json({error: err});
        } else {
            res.json({});
        }
    });
});

app.get("/sensors/", (req, res) => {
    console.log("get sensors", req.query);

    let device = new Device(id);

    device.getSensors((sensors, err) => {
        if (err) {
            res.json({error: err});
        } else {
            res.json(sensors);
        }
    });
});

app.post("/sensors/", (req, res) => {
    console.log("get sensors", req.body);

    let device = new Device(id);

    device.setSensors(req.body, (err) => {
        if (err) {
            res.json({error: err});
        } else {
            res.json({});
        }
    });
});

app.get("/limits/", (req, res) => {
    console.log("get limits", req.query);

    let device = new Device(id);

    device.getLimits((limits, err) => {
        if (err) {
            res.json({error: err});
        } else {
            res.json(limits);
        }
    });
});
app.post("/limits/", (req, res) => {
    console.log("get sensors", req.body);

    let device = new Device(id);

    device.setLimits(req.body, (err) => {
        if (err) {
            res.json({error: err});
        } else {
            res.json({});
        }
    });
});








// set port, listen for requests
const PORT = process.env.PORT || 8050;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);

    setTimeout(()=> {
    }, 1000)
});
