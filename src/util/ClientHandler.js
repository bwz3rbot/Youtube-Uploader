const CLIENT = require('./CLIENT.env.json');
/* 
    [Client Handler]
        - Loads the .json client
        - Option to encode for use with raw api calls, no wrapper
        - CLIENT.env.json must be stored in the same directory as the class
    */
module.exports = class ClientHandler {
    constructor() {
        this.CLIENT = CLIENT;
        this.ENCODED = {};
        return this;
    }
    encode() {
        let bufferId = Buffer.from(this.CLIENT.ID, 'utf-8');
        let bufferSecret = Buffer.from(this.CLIENT.SECRET, 'utf-8');
        this.ENCODED.ID = bufferId.toString('base64');
        this.ENCODED.SECRET = bufferSecret.toString('base64');
        return this.ENCODED;
    }
}