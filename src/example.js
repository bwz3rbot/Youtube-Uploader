const youtube = require('./service/YouTube');
/* 

    [Upload Videos To YouTube]
        - Maximum file size: 128GB
        - uri: uri to file
        - title: Title for the video
        - description: Description for the video
        - tags: An array of tags
        - privacyStatus: 'public' or 'private'
        - notifySubscribers: 'true' or 'false'
        - Returns the response from Youtube Data API v3

*/
(async () => {
    const video = new youtube.Video(
        uri = 'video.mp4',
        title = 'Web-Temps Developer Tutorials | Upload Videos To YouTube Using Node.JS',
        description =
        `I develop bots in JavaScript with Node.JS\n\n
        Go check out my repositories at https://www.github.com/web-temps\n\n
        You can message me any time on Reddit u/bwz3r\n\n
        Or if you prefer Discord Bingo-Bango-Botto#7079`,
        tags = ['web-temps', 'Node', 'backend', 'API', 'developer', 'tutorial'],
        privacyStatus = 'private',
        notifySubscribers = 'false'
    )
    const data = await youtube.upload(video);
    console.log(data);
})();