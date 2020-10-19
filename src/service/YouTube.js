const Youtube = require("youtube-api");
const fs = require("fs");
const Lien = require("lien");
const Logger = require("bug-killer");
const opn = require("opn");
const TokenValidator = require('../util/TokenValidator');
const TOKEN = new TokenValidator();
const ClientHandler = require('../util/ClientHandler');
CLIENT = new ClientHandler().CLIENT;

/* [Authenticate] */
const oauth = Youtube.authenticate({
    type: "oauth",
    client_id: CLIENT.web.client_id,
    client_secret: CLIENT.web.client_secret,
    redirect_url: CLIENT.web.redirect_uris[0]
});

/* [Validate Token] */
async function validateToken() {
    // Ask TokenValidator to verify existing token expiry date
    let token = TOKEN.validate();
    // If no existing token, get a new one
    if (!token) {
        Logger.log("NO EXISTING TOKEN OR TOKEN INVALID. ASKING GOOGLE FOR A NEW ONE...");
        try {
            token = await getNewToken();
            await TOKEN.refresh(token);
        } catch (err) {
            Logger.warn(`Caught this error while attempting to get a new token: ${err}`);
            Logger.warn("Exiting!");
            process.exit();
        }
    }
    oauth.setCredentials(token);
}

/* Get New Token */
async function getNewToken() {
    Logger.log("YT Upload Service getting a new token...");
    Logger.log("initializing the lien server...");
    // Init the server
    let server = new Lien({
        host: "localhost",
        port: 5000
    });
    // Listen for server on load
    server.on("load", err => {
        Logger.log(err || "Server started on port 5000.");
    });
    // Listen for server on errors
    server.on("serverError", err => {
        Logger.log("Server Error!", err.stack);
    });
    // Generate a subprocess that will
    // navigate the browser to the Oauth consent screen.
    opn(oauth.generateAuthUrl({
        access_type: "offline",
        scope: ["https://www.googleapis.com/auth/youtube.upload"]
    }));
    // Serve up the OAuth consent page
    let TOKENTORETURN; // OAuth promise begin...
    await new Promise(async (RES, reject) => {
        server.addPage("/oauth2callback", lien => {
            Logger.log("Trying to get the token using the following code: " + lien.query.code);
            oauth.getToken(lien.query.code, async (err, tokens) => {
                console.log("Finished getting the tokens!", tokens);
                if (err) {
                    lien.lien(err, 400);
                    console.log(err);
                    process.exit();
                } else {
                    TOKENTORETURN = tokens;
                    lien.end("Granted Oauth Token! Continuing with download.");
                    RES(Logger.log("Finally Resolved with the token!"));
                }
            });
        })
    }) // new Promise end here....
    return TOKENTORETURN;
}

/* Upload Video */
async function uploadVideo(filepath, title, description, private) {
    const privacy = private ? "public" : "private"
    Logger.log("Uploading video. Please wait. This could take a while....");
    console.log("Privacy set to: ", privacy);
    console.log("fs creating read stream from filepath: ", filepath);
    await new Promise(async (resolve, reject) => {
        try {
            await Youtube.videos.insert({
                resource: {
                    // Video title and description
                    snippet: {
                        title: title,
                        description: description
                    }
                    // I don't want to spam my subscribers
                    ,
                    status: {
                        privacyStatus: privacy
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
                    Logger.log(`Oh no! Something went wrong with the upload... ${err}`);
                    if (err.code === 403) {
                        throw new Error("403 ERROR - RATE LIMIT EXCEEDED!");
                    }
                } else {
                    Logger.log("Upload complete! Data returned:");
                    resolve(console.log(data));
                }
            });
            // Finished trying videos.insert()
        } catch (uploadErrors) {
            if (err) {
                Logger.warn("Error uploading video!");
                throw new Error(`Woah there was an error!\n${err}`);
            }
        }
    }) /* Promise resolved here. */
}

/* [Upload]
     - Takes in a filepath, title and description,
     - finds the file from the uri passedd
     - then uploads the video to youtube.
 */
async function upload(filepath, title, description, privacy) {
    Logger.log(`beginning upload: ${title}...`);
    // Validate the token
    await validateToken();
    // Upload the video
    Logger.log("UPLOADING VIDEO TO YOUTUBE...");

    Logger.log("GOT THE TOKEN");

    await uploadVideo(filepath, title, description, privacy);

    Logger.log("UPLOAD COMPLETE!");
}
module.exports = {
    upload
}