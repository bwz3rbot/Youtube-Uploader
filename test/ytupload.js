console.log("RUNNING YTUPLOAD SCRIPT...");
const Youtube = require("youtube-api");
const fs = require("fs");
const readJson = require("r-json");
const Lien = require("lien");
const Logger = require("bug-killer");
const opn = require("opn");
const {
    TokenValidator
} = require('./TokenValidator.js');

// CREDENTIALS = the CLIENT.env.json file (downloaded from the Google Developer Portal)
const CREDENTIALS = readJson(`${__dirname}/CLIENT.env.json`);

// Authenticate
const oauth = Youtube.authenticate({
    type: "oauth",
    client_id: CREDENTIALS.web.client_id,
    client_secret: CREDENTIALS.web.client_secret,
    redirect_url: CREDENTIALS.web.redirect_uris[0]
});

/* Upload:
     Takes in a filepath, title and description,
     finds the file from the uri passedd
      then uploads the video to youtube.
 */
async function upload(filepath, title, description) {
    console.log(`beginning upload: ${title}...`);
    // Validate the token
    await validateToken();
    // Upload the video
    console.log("UPLOADING VIDEO TO YOUTUBE...");
    await uploadVideo(filepath, title, description);
    console.log("UPLOAD COMPLETE!");
}

/* Validate Token */
let credsSet = false;
const Validator = new TokenValidator();
async function validateToken() {
    Logger.log(`Asking the TokenValidator to load the existing token...`);
    // Ask TokenValidator to verify existing token expiry date
    let token = Validator.validate();
    // If no existing token, get a new one
    if (!token) {
        Logger.log("NO EXISTING TOKEN OR TOKEN INVALID. ASKING GOOGLE FOR A NEW ONE...");
        try {
            token = await getNewToken();
        } catch (err) {
            Logger.warn("Caught this error while attempting to get a new token: ", err);
            Logger.warn("Exiting!");
            process.exit();
        }
        // Attach the new token to the validator object
        Validator.reset(token);
        // Let oauth know that it's time to set credentials again
        credsSet = false;
    }
    if (!credsSet) {
        // Set youtube Oauth Credentials to the token
        Logger.warn("Youtube Oauth Setting Credentials.");
        oauth.setCredentials(token);
        credsSet = true;
    }
    Logger.log("Token validated!");
}

/* Get New Token */
async function getNewToken() {
    console.log("YT Upload Service getting a new token...");
    console.log("initializing the lien server...");
    // Init the server
    let server = new Lien({
        host: "localhost",
        port: 5000
    });
    // Listen for server on load
    server.on("load", err => {
        console.log(err || "Server started on port 5000.");
    });
    // Listen for server on errors
    server.on("serverError", err => {
        console.log("Server Error!", err.stack);
    });

    // Generate an auth url with scope for youtube/upload
    opn(oauth.generateAuthUrl({
        access_type: "offline",
        scope: ["https://www.googleapis.com/auth/youtube.upload"]
    }));

    console.log("awaiting server adding the page...");
    // Serve up the OAuth consent page
    let TOKENTORETURN; // OAuth promise begin...
    await new Promise(async (RES, reject) => {
        server.addPage("/oauth2callback", lien => {
            Logger.log("Trying to get the token using the following code: " + lien.query.code);
            oauth.getToken(lien.query.code, async (err, tokens) => {
                TOKENTORETURN = tokens;
                if (err) {
                    lien.lien(err, 400);
                    throw new Error(Logger.log(err));
                }
                Logger.log("Got the token.");
                console.log("Awaiting write token to file....");
                const NEWTOKEN = JSON.stringify(tokens, null, 4);
                await new Promise((resolve, reject) => {
                    fs.writeFile('./MYTOKEN.env.json', NEWTOKEN, 'utf8', (err) => {
                        if (err) reject(console.error("Oops!", err));
                        else {
                            resolve((console.log("saved!")));
                            lien.end("Granted Oauth Token!");
                            RES(console.log("Finally Resolved with the token!"));
                        }
                    });
                })
            });
        })
    }) // new Promise end here....
    return TOKENTORETURN;
}

/* Upload Video */
async function uploadVideo(filepath, title, description) {
    console.log("UPLOADIGNG VIDEO: ", {
        filepath,
        title,
        description
    });

    const req = await Youtube.videos.insert({
        resource: {
            // Video title and description
            snippet: {
                title: title,
                description: description
            }
            // I don't want to spam my subscribers
            ,
            status: {
                privacyStatus: "private"
            }
        }
        // This is for the callback function
        ,
        part: "snippet,status"

            // Create the readable stream to upload the video
            ,
        media: {
            body: fs.createReadStream(filepath)
        }
    }, (err, data) => {
        if (err) {
            Logger.warn(`Error uploading the data! Error:: ${err}`);
        }
        Logger.log(`Finished processing upload`);
        Logger.log(data);
    });
    setInterval(function () {
        // Logger.log(`${prettyBytes(req.req.connection._bytesDispatched)} bytes uploaded.`);
        Logger.log("Byes uploaded supposed to go here but the reference to _bytesDispatched breaks things.... So here is just the request instead: ");
        Logger.log(req);
    }, 250);
}





// TEST:
function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
    const videos = [{
        uri: 'video.mp4',
        title: '1st upload title',
        description: '1st upload description'
    }, {
        uri: 'video.mp4',
        title: '2nd upload title',
        description: '2nd upload description'
    }, {
        uri: 'video.mp4',
        title: '3rd upload title',
        description: '3rd upload description'
    }, ]
    for await (const video of videos) {
        await upload(video.uri, video.title, video.description);
    }
})();

module.exports = {
    upload
}