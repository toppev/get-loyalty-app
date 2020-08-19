const fs = require('fs');
// deprecated but will still use as it just works
const request = require('request');

const BASE_URL = process.env.SS_BASE_URL || 'http://localhost:3001';
const SERVICE_URL = process.env.SS_SERVICE_URL || 'http://localhost:3005';

module.exports = {
    takeScreenshot
}

/**
 * Request the service to take a screenshot of the given url and save it in a file
 *
 * @param {string} path the url to screenshot
 * @param {string} fileName the name of the file, including suffix
 * @param {boolean} fullUrl whether the path is full url or BASE_URL prefix should be used
 */
async function takeScreenshot(path, fileName, fullUrl = false) {
    return new Promise((resolve, reject) => {
        if (process.env.NODE_ENV === 'test') {
            return;
        }
        const url = fullUrl ? path : BASE_URL + path
        const stream = request.get(`${SERVICE_URL}?url=${url}`, {}, (err, _res, _body) => {
            if (err) {
                reject(err)
            }
        }).pipe(fs.createWriteStream(fileName));
        stream.on('error', reject);
        stream.on('finish', () => resolve(fileName));
    })
}