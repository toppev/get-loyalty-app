const fs = require('fs');
// deprecated but will still use as it just works
const request = require('request');

// FIXME might want to change these
const BASE_URL = 'http://localhost:3000/';
const SERVICE_URL = 'http://localhost:3005/';

module.exports = {
    takeScreenshot
}

/**
 * Request the service to take a screenshot of the given url and save it in a file
 * @param {string} path the url to screenshot
 * @param {string} fileName the name of the file without suffix
 */
async function takeScreenshot(path, fileName, fullUrl = false) {
    request.get(SERVICE_URL, {
        json: { url: fullUrl ? path : BASE_URL + path }
    }, (err, res, body) => {
        if (err && process.env.NODE_ENV !== 'test') {
            console.log(`Failed to request a screenshot ${err}`)
        }
    }).pipe(fs.createWriteStream(`${fileName}.jpeg`));
}