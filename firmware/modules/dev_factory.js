// Port device factory
const RelayPort = require('relay');
const OneWirePort = require('1wire');

module.exports = function(type, params, conf) {
    switch (type) {
        case 'relay':
            return new RelayPort(params, () => 1);
        case 'onewire':
            return new OneWirePort(params, conf.onewire);
        default:
            throw new Error("Unknown device port type " + type);
    }
}
