module.exports = {
    wifi: {
        ssid: "My-WIFI-AP",
        password:   "My-WIFI-pass"
    },
    mqtt: {
        host: "192.168.0.1",
        port: 1883,
        username: "user",
        password: "pass",
    },
    job: {
        tLoop: 2
    },
    ow: {
        pin: D4,
        tCheck: 10,
        tSend: 15
    },
    relays: {
        compr: D5,
        comprFan: D18,
        heater: D19,
        fan: D21
    }
}
