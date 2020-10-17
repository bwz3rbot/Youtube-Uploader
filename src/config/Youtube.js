const {
    google
} = require('googleapis');
const youtube = google.youtube('v3');
const fs = require('fs');
class Youtube {
    constructor(creds) {
        this.creds = creds;
        this.youtube = youtube;
    }

    // Upload a video
    async uploadVideo(uri) {
        console.log("Youtube uploading video from this uri:", uri);
        await youtube.videos.insert({
            key: this.creds.KEY,
            resource: {
                // Video title and description
                snippet: {
                    title: "Testing YoutTube API NodeJS module again",
                    description: "Test video upload via YouTube API"
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
                body: fs.createReadStream(uri)
            }
        }, (err, data) => {

            if (err) {
                console.log(err);
            } else {
                console.log("Done.", data);
            }
            process.exit();
        });

    }

    // Test the key was correctly implanted
    async runTest() {
        console.log("Running Test with these creds..", this.creds);
        const results = await youtube.search.list({
            key: this.creds.KEY,
            "part": [
                "snippet"
            ],
            "maxResults": 25,
            "q": "Test"
        });
        return results;
    }
}
const config = function (creds) {
    return new Youtube(creds);
}


module.exports = {
    config
}