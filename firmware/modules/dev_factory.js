// Port device factory
const RelayPort = require('relay');
const OneWirePort = require('1wire');

module.exports = function(type, conf, unitconf) {
    switch (type) {
        case 'relay':
            return new RelayPort(conf, () => 1);
        case 'onewire':
            return new OneWirePort(conf, unitconf.onewire);
        default:
            throw new Error("Unknown device port type " + type);
    }
}
