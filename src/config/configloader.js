const C = require('../../config.env.json');
class Configuration {
    constructor(config) {
        this.config = config
        return this.config
    }
}
const loadconfig = function () {
    return new Configuration(C);
}
module.exports = {
    loadconfig
}