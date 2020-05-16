const request = require("request");

const BASE_URL = process.env.POLLING_BASE_URL || 'http://localhost:8080/';

function sendToUser(userId, data, type = '') {
    const testing = process.env.NODE_ENV === 'test';
    if (testing) return;
    const id = `${type}_${userId}`
    data = JSON.stringify(data);
    try {
        request({
            headers: {
                'Content-Length': data.length,
                'Content-Type': 'application/json; charset=utf-8',
                'Polling-Authentication': process.env.POLLING_AUTHENTICATION
            },
            uri: `${BASE_URL}/${id}`,
            body: data,
            method: 'POST'
        })
    } catch (err) {
        console.log(`Failed to poll user ${err}`)
    }
}


module.exports = {
    sendToUser
}