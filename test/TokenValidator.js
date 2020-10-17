const fs = require('fs');
const TOKEN_LOCATION = './MYTOKEN.ENV.JSON';
class TokenValidator {
    constructor() {
        this.token = JSON.parse(fs.readFileSync(TOKEN_LOCATION));
    }
    // Takes in a filepath to a bearer token & verifies the expiry_date
    // Returns the original token object, or false if expired.
    validate() {
        this.token = checkTimestamp(this.token);
        return this.token;
    }
    reset(newToken) {
        this.token = newToken;
    }
}

// Check the timestamp
const checkTimestamp = function (token) {
    const d = new Date();
    const now = Math.round(d.valueOf() / 1000);

    if (now <= token.expiry_date) {
        return token
    } else {
        return false;
    }
}

// RUN TEST
async function TEST() {
    const TV = new TokenValidator();
    await TV.validate('./MYTOKEN.env.json');
    await TV.validate('./MYTOKEN.env.json');
    await TV.validate('./MYTOKEN.env.json');
    await TV.validate('./MYTOKEN.env.json');
}


module.exports = {
    TokenValidator
}