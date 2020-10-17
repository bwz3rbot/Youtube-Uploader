a# YT-UPLOADER template

## Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Getting an API KEY](#key)
    - [Enable Youtube Data API](#enable)
    - [Get Your Credentials](#creds)
- [OAUTH](#OAUTH)

## About <a name = "about"></a>

This template is for adding a youtube uploader to different projects.

## Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See [deployment](#deployment) for notes on how to deploy the project on a live system.



## HOW TO ENABLE THE YOUTUBE DATA API ON A GOOGLE ACCOUNT: <a name ="enable"></a>

1. Navigate to https://console.developers.google.com/apis/library
2. Search for "Youtube Data API V3"
3. If prompted, select a project, or create a new one
4. Select the API and then click the `ACTIVATE` button to use it on your google account

# Getting an API key <a name="key"></a>

1. Go the the [credentials page](https://console.developers.google.com/apis/credentials)
2. Click `Create Credentials`
3. Select `API Key`
4. Copy the key and paste it into pw.env



# OAUTH <a name="oauth"></a>
This part is only nececary if you are making a client facing web app. Server side node bots aren't going to require this of a user. This is most likely done by the developer one time and the consent screen alows a user to approve the application.

## Creating OAUTH Credentials <a name = "creds"></a>
This section assumes you have completed the previous section: [__HOW TO ENABLE THE YOUTUBE DATA API ON A GOOGLE ACCOUNT__](#enable)

1. Go the the [credentials page](https://console.developers.google.com/apis/credentials)
2. Click Create credentials > OAuth client ID.
3. Now click to `CONFIGURE CONSENT SCREEN`
4. Average users may only  use `External` user types. Only G-Suite users can select an `Internal` application
5. Click `Create`
6. Give the application a name
7. Select scopes
8. Save
9. Select the Web application application type.

...

Fill in the form and click Create. Applications that use languages and frameworks like PHP, Java, Python, Ruby, and .NET must specify authorized redirect URIs. The redirect URIs are the endpoints to which the OAuth 2.0 server can send responses.

 For testing, you can specify URIs that refer to the local machine, such as http://localhost:8080. With that in mind, please note that all of the examples in this document use http://localhost:8080 as the redirect URI.

 We recommend that you design your app's auth endpoints so that your application does not expose authorization codes to other resources on the page. 


# Links <a name="links"></a>
[Uploading Videos to Youtube Using NodeJS Tutorial](https://www.codementor.io/@johnnyb/uploading-videos-to-youtube-with-nodejs-google-api-du107ynot)

[Creating a Service Account](https://developers.google.com/api-client-library/dotnet/guide/aaa_oauth#service-account)

[Creating a Standalone](https://developers.google.com/youtube/v3/guides/moving_to_oauth#standalone)

[Javascript GAPI Quickstart Guide](https://developers.google.com/youtube/v3/quickstart/js)

[Getting API Key Or OAUTH Credentials](https://developers.google.com/youtube/v3/getting-started)

[Youtube Data API v3 Reference](https://developers.google.com/youtube/v3/docs/)

https://developers.google.com/youtube/registering_an_application\
https://developers.google.com/youtube/v3/guides/auth/client-side-web-apps
