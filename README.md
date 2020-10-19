# Youtube-Uploader

## Table of Contents

- [About](#about)
- [Usage](#usage)
- [Resources](#resources)
- [Getting Started](#getting_started)
    - [Creating A Google Application](#create_app)


# About <a name = "about"></a>

__Youtube-Uploader__ exports a single function: *upload*, and class: __Video__, which when used together will allow a developer to upload videos to Youtube.

The instructions in this readme will guide you through the process of setting up an application in the Google Developer Console. Once you have your application created you will generate an OAuth2 client in the __Developer Console__, download the client as a json file and paste it into the code.

# Usage <a name="usage"></a>


```javascript
const youtube = require('YouTube');
/* 

    [Upload A Video To YouTube]
        - Maximum file size: 128GB
        - uri: uri to file
        - title: Title for the video
        - description: Description for the video
        - tags: An array of tags
        - privacyStatus: 'public' or 'private'
        - notifySubscribers: 'true' or 'false'
        - Returns the response from Youtube Data API v3

*/

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

    
```


# Resources <a name="resources"></a>

A collection of resources to use when developing applications using the Youtube Data API.


Resource | Location
------------ | -------------
youtube-api Documentation | https://www.npmjs.com/package/youtube-api
OAuth NodeJS Quickstart | https://developers.google.com/people/quickstart/nodejs
Uploading Videos to Youtube Using NodeJS Tutorial | https://www.codementor.io/@johnnyb/uploading-videos-to-youtube-with-nodejs-google-api-du107ynot
Creating a Service Account | https://developers.google.com/api-client-library/dotnet/guide/aaa_oauth#service-account
Creating a Standalone | https://developers.google.com/youtube/v3/guides/moving_to_oauth#standalone
Javascript GAPI Quickstart Guide | https://developers.google.com/youtube/v3/quickstart/js
YouTube Data API Overview| https://developers.google.com/youtube/v3/getting-started
YouTube Data API Documentation | https://developers.google.com/youtube/v3/docs/

# Getting Started <a name = "getting_started"></a>


Youtube-Uploader is written in JavaScript and requires NodeJS to run. You can find the download for your OS [here](https://nodejs.org/en/download/).


## Creating A Google Application <a name = "create_app"></a>



1. Go to the [Google Developer Console](https://console.developers.google.com/project) and Click `CREATE PROJECT`.
<img src="https://i.imgur.com/9gBypeJ.png"/>

2. Give it a name and click `CREATE`.
<img src="https://imgur.com/SuSoOsi.png"/>

3. Click the hamburger icon to open the menu and go to the `Library` tab.
<img src="https://imgur.com/GIALifM.png"/>

4. Search for __Google Data API v3__.
<img src="https://imgur.com/SOrDtJK.png"/>

5. Select the API.
<img src="https://imgur.com/iGLCqeO.png"/>

6. `ENABLE` the API for your app. Be sure to select the correct application from the dropdown if you have already created one in the past.
<img src="https://imgur.com/4VCwvVV.png"/>

7. Now back in the __Dashboard__, navigate to the __Credentials__ tab and click `CONFIGURE CONSENT SCREEN`. 
<img src="https://imgur.com/6eC0eHk.png"/>

8. Select `External User Type` and then click `CREATE`. 
<img src="https://imgur.com/oXXXNfI.png"/>

9. Give your application a name and then `Save`. 
<img src="https://imgur.com/cjk4sj5.png"/>

10. You will see a warning about your apps __verification status__. This means that Google has not yet verified the code. I won't go over the process to verify your app in this tutorial, as it is not nececary to get started. Just know that when you start the app and use the __Oauth Consent Screen__, it will show a warning that the app could be potentially dangerous. This is normal. It will remain this way until you you complete the application verification process. Read more about verifying your app [here](https://developers.google.com/apps-script/guides/client-verification).
<img src="https://imgur.com/KvNNwXb.png"/>


11. In the __Credentials__ tab, click `CREATE CREDENTIALS`. Select `OAuth Client ID`.
<img src="https://imgur.com/Bv7P6y4.png"/>

12. Create Oauth clientID
- Set `Application Type` to `Web Application`.
- Set the authorized JavaScript Origins to be: `http://localhost:5000`
- Set the Authorized redirect URIs to be: `http://localhost:5000/oauth2callback`
- Click `CREATE` to create the Oauth clientID\
The application will create a server instance on your localhost at port 5000 to generate the __Oauth Consent Screen__.
<img src="https://imgur.com/kEHxP9e.png"/>

13. In the __Credentials__ tab of your __Dashboard__, download your Oauth Client. Rename the file to `CLIENT.env.json` and move it to the root directory of this codebase.
__DO NOT SHARE THE CLIENT SECRET WITH ANYONE. IT IS YOUR APPLICATIONS PASSWORD.__ 
<img src="https://imgur.com/upgyYzI.png"/>


14. The first time you run the code, the consent screen will be served to your browser and will prompt you to grant the application permission access to your account. Click `Show Advanced` to unhide the option to *go to your app*.
<img src="https://imgur.com/QJqxzmA.png"/>

15. Follow the steps to allow the application access to your account. You must grant the application the `Manage your YouTube videos` permission.
<img src="https://imgur.com/SvUtyEk.png"/>

