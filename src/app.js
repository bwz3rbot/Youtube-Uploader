require('colors');

// Start the app with config file
const config = require('./config/configloader').loadconfig();

// Load Youtube with user config file
const Youtube = require('./config/Youtube').config(config.GAPI);

// Run Youtube Test
(async () => {
    console.log("Asking Google to run Test...");
    await Youtube.uploadVideo('./exampleVideo.mp4');
})();