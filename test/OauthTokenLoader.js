const Logger = require('bug-killer');
const fs = require('fs');
class OauthVerifier {
    constructor(creds) {
        this.filepath = creds;
        this.OauthCredentials = null;
        this.expiry_date = null;
    }
    // Takes in a filepath checks the timestamp of the oauth object
    // If the timestamp is out of date, asks YTUploadService for a new one
    async verify(filepath) {
        Logger.log(`OauthVerifier verifying token from filepath: ${filepath}`);
        let foundToken;
        try {
            foundToken = fs.readFileSync(filepath);
        } catch (err) {
            if (err) {
                Logger.warn(`Error!: `, err);
                return false;
            } else {
                Logger.log("Got it!");
            }
        }
        return checkTimestamp(JSON.parse(foundToken));
    }

}


// Check the timestamp
async function checkTimestamp(token) {
    console.log("Checking the timestamp...");
    console.log("creds:", token);
    const d = new Date();
    const now = Math.round(d.valueOf() / 1000);
    Logger.log(`Current Epoch: ${now}`);
    Logger.log(`Found Epoch: ${token.expiry_date}`);
    console.log(`Verifying: ${now} is >= ${token.expiry_date}`);
    if (now <= token.expiry_date) {
        console.log(`Now: ${now} was <= ${token.expiry_date}, returning the token.`);
        return token
    } else {
        console.log("Past expiry date! Returning false...");
        return false;
    }


}




async function loadToken(filepath) {
    return fs.readFileSync(filepath);
}






const verifier = new OauthVerifier();

// RUN TEST
// (async () => {

//     await verifier.verify('./MYTOKEN.env.json')
// })();

module.exports = {
    OauthVerifier
}