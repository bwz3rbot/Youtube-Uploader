/**
 * This script uploads a video (specifically `video.mp4` from the current
 * directory) to YouTube,
 *
 * To run this script you have to create OAuth2 credentials and download them
 * as JSON and replace the `credentials.json` file. Then install the
 * dependencies:
 *
 * npm i r-json lien opn bug-killer
 *
 * Don't forget to run an `npm i` to install the `youtube-api` dependencies.
 * */

console.log("RUNNING YTUPLOAD SCRIPT...");
const Youtube = require("youtube-api"),
    fs = require("fs"),
    readJson = require("r-json"),
    Lien = require("lien"),
    Logger = require("bug-killer"),
    opn = require("opn"),
    prettyBytes = require("pretty-bytes"),
    {
        OauthVerifier
    } = require('./OauthTokenLoader'),
    TOKEN_LOCATION = './MYTOKEN.ENV.JSON';


console.log("Finished requireing dependencies... Reading credentials...");
// I downloaded the file from OAuth2 -> Download JSON
const CREDENTIALS = readJson(`${__dirname}/SECRET.env.json`);
console.log("Got these credentials: ", CREDENTIALS);
// Get the authentication instance.
const oauth = Youtube.authenticate({
    type: "oauth",
    client_id: CREDENTIALS.web.client_id,
    client_secret: CREDENTIALS.web.client_secret,
    redirect_url: CREDENTIALS.web.redirect_uris[0]
});

// // Init lien server
// let server = new Lien({
//     host: "localhost",
//     port: 5000
// });

// // Authenticate
// // You can access the Youtube resources via OAuth2 only.
// // https://developers.google.com/youtube/v3/guides/moving_to_oauth#service_accounts
// let oauth = Youtube.authenticate({
//     type: "oauth",
//     client_id: CREDENTIALS.web.client_id,
//     client_secret: CREDENTIALS.web.client_secret,
//     redirect_url: CREDENTIALS.web.redirect_uris[0]
// });

// opn(oauth.generateAuthUrl({
//     access_type: "offline",
//     scope: ["https://www.googleapis.com/auth/youtube.upload"]
// }));

// // Handle oauth2 callback
// server.addPage("/oauth2callback", lien => {
//     Logger.log("Trying to get the token using the following code: " + lien.query.code);
//     oauth.getToken(lien.query.code, async (err, tokens) => {

//         if (err) {
//             lien.lien(err, 400);
//             return Logger.log(err);
//         }

//         Logger.log("Got the tokens.", tokens);

//         console.log("Awaiting write file....");
//         await new Promise((resolve, reject) => {
//             fs.writeFile(TOKEN_LOCATION, JSON.stringify(tokens, null, 4), 'utf8', (err) => {
//                 if (err) reject(console.error("Oops!", err));
//                 else {
//                     resolve(Logger.log("saved!"));
//                 }

//             });
//         })


//         Logger.log("Youtube Oauth Setting credentials...");
//         oauth.setCredentials(tokens);

//         lien.end("The video is being uploaded. Check out the logs in the terminal.");

//         await uploadVideo();



//     });
// });







// Main Exported Function. Takes in a filepath and uploads to youtube.
// Checks existing token timestamp, create a new server instance to re-verify if nececary
async function upload(filepath, title, description) {
    // Load the existing token.
    let token;
    console.log("LOADING AN EXISTING TOKEN...")
    const existingToken = await loadExisting();
    // If no existing token, get a new one
    if (!existingToken) {
        console.log("NO EXISTING TOKEN. GETTING A NEW ONE...");
        token = await getNewToken(oauth);
    } else {
        console.log("Token verified! Continuing with upload!");
        token = existingToken;
    }


    console.log("Got this token: ", token);

    // opn(oauth.generateAuthUrl({
    //     access_type: "offline",
    //     scope: ["https://www.googleapis.com/auth/youtube.upload"]
    // }));


    // Set youtube Oauth Credentials to the token
    Logger.log("Youtube Oauth Setting credentials...");

    /*
    TODO: if there is an error when the rate limit goes away,
    try creating an initializeSetCredentials fucntion.
    Maybe it won't like calling oauth.setCredentials every time upload is called....
    */ 
    oauth.setCredentials(token);
    console.log("Successfully Reached the point of uploading a video.");
    // Upload the video to youtube
    console.log("SIMULATING UPLOAD....");
    await timeout(3000)
    await uploadVideo(filepath, title, description);
    console.log("UPLOAD COMPLETE!");
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


// RUN TEST::
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





// Load old token and check timestamp. Refresh if nececary.
async function loadExisting() {
    Logger.log(`Asking the OauthVerifier to load the existing token...`);
    // Ask OauthVerifier to verify existing token expiry date
    return new OauthVerifier().verify(TOKEN_LOCATION);

}


// Get New Token
async function getNewToken(oauth) {
    console.log("YT Upload Service getting a new token...");


    console.log("initializing the lien server...");
    // Init lien server
    let server = new Lien({
        host: "localhost",
        port: 5000
    });

    console.log("Open Oauth Generating auth url...");
    opn(oauth.generateAuthUrl({
        access_type: "offline",
        scope: ["https://www.googleapis.com/auth/youtube.upload"]
    }));



    console.log("awaiting server adding the page...");
    // Handle oauth2 callback

    let TOKENTORETURN;
    await new Promise(async (resolve, reject) => {
        server.addPage("/oauth2callback", lien => {
            Logger.log("Trying to get the token using the following code: " + lien.query.code);
            oauth.getToken(lien.query.code, async (err, tokens) => {
                TOKENTORETURN = tokens;
                if (err) {
                    lien.lien(err, 400);
                    return Logger.log(err);
                }
                Logger.log("Got the tokens.", tokens);
                console.log("Awaiting write file....");

                const NEWTOKEN = JSON.stringify(tokens, null, 4);
                await new Promise((resolve, reject) => {
                    fs.writeFile('./MYTOKEN.env.json', NEWTOKEN, 'utf8', (err) => {
                        if (err) reject(console.error("Oops!", err));
                        else {
                            resolve((console.log("saved!")));
                        }

                    });
                })

                await lien.end("Granted Oauth Token!");
                resolve(tokens);

            });
        })
    })

    return TOKENTORETURN;

}


// Upload Video
async function uploadVideo(filepath, title, description) {

    console.log("UPLOADIGNG VIDEO: ", {
        filepath,
        title,
        description
    })

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
        console.log(data);
    });



    // setInterval(function () {
    //     // Logger.log(`${prettyBytes(req.req.connection._bytesDispatched)} bytes uploaded.`);
    // }, 250);
}


module.exports = {
    upload
}