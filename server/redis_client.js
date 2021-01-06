const redis = require("redis");
const { promisify } = require('util');
const client = redis.createClient("redis://localhost:6379?db=4");

client.on('connect', function() {
    console.log("Redis server connected");
});

client.on('error', err => {
    console.log('Redis DB error ' + err);
});

// console.log("connecting redis server");

module.exports = {
    set: promisify(client.set).bind(client),
    get: promisify(client.get).bind(client),
    client
}
