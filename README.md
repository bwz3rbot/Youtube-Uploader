# Youtube-Uploader

## Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
    - [Creating A Google Application](#create_app)
- [Resources](#resources)


# About <a name = "about"></a>

__Youtube-Uploader__ exports a single function `upload`, which allows a developer to upload videos to Youtube. The `upload` function takes in a filename, loads the file from your hard drive, then uploads the file to youtube. The instructions in this readme will guide you through the process of setting up an application in the Google Developer Console. Once you have your application created you will generate an OAuth2 client in the __Developer Console__, download the client as a JSON file and paste it into the code.

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

5. Select the api.
<img src="https://imgur.com/iGLCqeO.png"/>

6. `ENABLE` the API for your app. Be sure you have selected the correct application if you have created more than one in the past.
<img src="https://imgur.com/4VCwvVV.png"/>

7. Now back in the __Dashboard__, navigate to the __Credentials__ tab and click `CONFIGURE CONSENT SCREEN`. 
<img src="https://imgur.com/6eC0eHk.png"/>

8. Select `External` and then click `CREATE`. 
<img src="https://imgur.com/oXXXNfI.png"/>

9. Give it a name and then `Save`. 
<img src="https://imgur.com/cjk4sj5.png"/>

10. You will see a warning about your apps' __verification status__. This means that Google has not verified the code. I won't go over the process to verify your app in this tutorial, as it is not nececary to get started. Just know that when you start the app and use the __Oauth Consent Screen__, it will show a warning that the app could be potentially dangerous. This is normal. It will remain this way until you you complete the application verification process. Read more about verifying your app [here](https://developers.google.com/apps-script/guides/client-verification).
<img src="https://imgur.com/KvNNwXb.png"/>


11. In the __Credentials__ tab, click `CREATE CREDENTIALS`. Select `OAuth Client ID`.
<img src="https://imgur.com/Bv7P6y4.png"/>

12. Create Oauth clientID
- Set `Application Type` to `Web Application`.
- Set the authorized JavaScript Origins to be: `http://localhost:5000`
- Set the Authorized redirect URIs to be: `http://localhost:5000/oauth2callback`\
The application will create a server instance on your localhost at port 5000 to generate the __Oauth Consent Screen__.
<img src="https://imgur.com/kEHxP9e.png"/>

13. In the __Credentials__ tab of your __Dashboard__, download your client secret. Rename the file to `OAUTH.env.json` and move it to the root directory of this codebase.
__DO NOT SHARE THE CLIENT SECRET WITH ANYONE. IT IS YOUR APPLICATIONS' PASSWORD.__ 
<img src="https://imgur.com/upgyYzI.png"/>


14. The first time you run the code, the consent screen will be served to your browser and will prompt you to grant the application permission access to your account. Click `Show Advanced` to unhide the option to *go to your app*.
<img src="https://imgur.com/QJqxzmA.png"/>

15. Follow the steps to allow the application access to your account. You must grant the application the `Manage your YouTube videos` permission.
<img src="https://imgur.com/SvUtyEk.png"/>




# Resources <a name="resources"></a>
[Uploading Videos to Youtube Using NodeJS Tutorial](https://www.codementor.io/@johnnyb/uploading-videos-to-youtube-with-nodejs-google-api-du107ynot)

[Creating a Service Account](https://developers.google.com/api-client-library/dotnet/guide/aaa_oauth#service-account)

[Creating a Standalone](https://developers.google.com/youtube/v3/guides/moving_to_oauth#standalone)

[Javascript GAPI Quickstart Guide](https://developers.google.com/youtube/v3/quickstart/js)

[YouTube Data API Overview](https://developers.google.com/youtube/v3/getting-started)

[API Documentation](https://developers.google.com/youtube/v3/docs/)
