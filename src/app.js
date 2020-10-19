require('colors');
console.log("RUNNING THE APP...".rainbow);
console.log("REQUIRING YOUTUBE PACKAGE".magenta);
const youtube = require('./service/YouTube');
console.log("CREATING NEW INSTANCE OF YOUTUBE...".magenta);
// Run Youtube Test
(async () => {
    console.log('RUNNING TEST')
    const videos = [{
        uri: 'video.mp4',
        title: '7st success title!',
        description: '1st success description'
    }, {
        uri: 'video.mp4',
        title: '8nd success title!',
        description: '2nd success description'
    }, {
        uri: 'video.mp4',
        title: '9rd success title!',
        description: '3rd success description'
    }, ]
    for await (const video of videos) {
        console.log("TESTING THE NEXT VIDEO: ", video);
        await youtube.upload(video.uri, video.title, video.description, true);
    }
})();