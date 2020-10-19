const Youtube = require("youtube-api");
const fs = require("fs");
const Lien = require("lien");
const opn = require("opn");
const TokenValidator = require('../util/TokenValidator');
const TOKEN = new TokenValidator();
const ClientHandler = require('../util/ClientHandler');
CLIENT = new ClientHandler().CLIENT;

/*
    [Authenticate]
        - youtube-api wrapper for Youtube Data v3
        - https://www.npmjs.com/package/youtube-api
*/
const oauth = Youtube.authenticate({
    type: "oauth",
    client_id: CLIENT.web.client_id,
    client_secret: CLIENT.web.client_secret,
    redirect_url: CLIENT.web.redirect_uris[0]
});

/*
    [Validate Token]
        - TokenValidator class checks expiry_date
        - If invalid, await getNewToken function
        - Save the token to disk by awaiting TokenValidator.refresh(token)
        - oauth sets credentials.
            - This function is called each time the *download* function is envoked.
            - The first time this function is called, oauth will set credentials, then set valid to true.
            - oauth will not set credentials again until token is invalidated.

 */
let valid = false;
async function validateToken() {
    // Ask TokenValidator to verify existing token expiry date
    let token = TOKEN.validate();
    // If no existing token, get a new one
    if (!token) {
        valid = false;
        token = await getNewToken();
        await TOKEN.refresh(token);
    }
    // Will be called many times in succession if no invalid flag exists
    // Very unnececary.
    if (!valid) {
        oauth.setCredentials(token);
        valid = true;
    }

}

/*
    [Get New Token]
        - Initiates the server
        - Adds error and load listeners
        - opn generates a subprocess and navigates browser to the authUrl
        - Await the server add a new page (/oauth2callback)
        - Once the user authorization process is completed in the browser, the user will be navigated back to localhost/oauth2callback:5000
        - oauth gets the token from the query string and server ends the response
        - The promise is resolved and token is returned
*/
async function getNewToken() {
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
            oauth.getToken(lien.query.code, async (err, tokens) => {
                if (err) {
                    lien.lien(err, 400);
                    console.log(err);
                } else {
                    TOKENTORETURN = tokens;
                    lien.end("Granted Oauth Token! Continuing with download.");
                    RES("Finally Resolved with the token!");
                }
            });
        })
    });
    return TOKENTORETURN;
}

/* 
    [Upload Video]
*/
async function uploadVideo(video) {
    console.log(`Uploading video. Please wait. This could take a while....`);
    return new Promise(async (resolve, reject) => {
        try {
            await Youtube.videos.insert({
                resource: {
                    snippet: {
                        title: video.title,
                        description: video.description,
                        tags: video.tags
                    },
                    status: {
                        privacyStatus: video.privacy
                    }
                },
                part: "snippet,status,id,contentDetails,processingDetails,statistics",
                media: {
                    body: fs.createReadStream(video.uri)
                },
                notifySubscribers: video.notifySubscribers
            }, (err, data) => {
                if (err) {
                    if (err.code === 403) {
                        throw new Error("403 ERROR - RATE LIMIT EXCEEDED!");
                    }
                    throw new Error(`Oh no! Something went wrong with the upload... ${err}`);
                } else {
                    console.log("Upload complete! Data returned:");
                    resolve(data);
                }
            });
        } catch (uploadErrors) {
            if (uploadErrors) {
                throw new Error(`Woah there was an error uploading the video!\n${uploadErrors}`);
            }
        }
    });
}


/* 
    [Video]
*/
class Video {
    constructor(uri, title, description, tags, privacy, notifySubscribers) {
        this.uri = uri;
        this.title = title;
        this.description = description;
        this.tags = tags;
        this.privacy = privacy ? privacy : 'private';
        this.notifySubscribers = notifySubscribers;
    }
}

/* [Upload]
     - Takes in a Video object,
     - Validates the token stored in disk
     - Gets a new token if the old one is bad or does not exist
     - Uploads the video to youtube
 */
async function upload(video) {
    // Validate the token
    await validateToken();
    // Upload the video
    return uploadVideo(video);
}
module.exports = {
    Video,
    upload
}