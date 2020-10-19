const fs = require('fs');
const TOKEN_LOCATION = __dirname + '\\TOKEN.env.json';
/* 
    [Set Token]
        - Token will be stored in the same directory as the class
 */
function setToken() {
    let foundToken;
    try {
        foundToken = JSON.parse(fs.readFileSync(TOKEN_LOCATION));
        return foundToken;
    } catch (err) {
        if (err) {
            return false;
        }
    }
}
/*
    [Check Timestamp]
        - Checks the token_expiry date against the current epoch
 */
function checkTimestamp(token) {
    const d = new Date();
    const now = Math.round(d.valueOf() / 1000);
    return (now <= token.expiry_date) ? token : false;
}
/* 
    [Store New Token]
        - Saves a token to disk
 */
async function storeNew(token) {
    const NEWTOKEN = JSON.stringify(token, null, 4);
    await new Promise((resolve, reject) => {
        fs.writeFile(TOKEN_LOCATION, NEWTOKEN, 'utf8', (err) => {
            if (err) reject(() => {
                throw new Error(`Error saving token! ${err}`)
            });
            else {
                resolve("file saved!");
            }
        });
    })
    return token;
}
/* 
    [Token Validator Class]
        - Validates token expiry_date
        - Saves new token to disk
*/
module.exports = class TokenValidator {
    constructor() {
        this.token = setToken();
    }
    // Takes in a filepath to a bearer token & verifies the expiry_date
    // Returns the original token object, or false if expired.
    validate() {
        this.token = checkTimestamp(this.token);
        return this.token;
    }
    // Stores the token to disk
    async refresh(newToken) {
        this.token = await storeNew(newToken);
    }

}