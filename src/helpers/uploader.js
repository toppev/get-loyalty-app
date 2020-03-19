
/* TODO: maybe later
const AWS = require('aws-sdk');

const PAGE_IMAGES_BUCKET = 'kantis-page-images';
const PAGE_HTML_BUCKET = 'kantis-page-html';


const params = {
    Bucket: uploader.PAGE_HTML_BUCKET,
    Key: `page_${pageData.id}.html`,
    Body: html,
    ContentType: 'text/html'
};

uploader.s3.upload(params, function(err, data) {
    if (err) {
        throw err;
    }
    // Success
});

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
});
*/
const fs = require('fs');
const { sep } = require('path');

const uploadDir = process.env.UPLOAD_DIR || process.env.PWD.concat(`${sep}uploads`);
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

function toPath(fileName) {
    return uploadDir + sep + fileName;
}

async function upload(fileName, data) {
    fs.writeFile(toPath(fileName), data, function (err) {
        if (err) {
            throw err;
        }
        // Success    
    });
}

module.exports = {
    //PAGE_IMAGES_BUCKET,
    //PAGE_HTML_BUCKET,
    uploadDir,
    upload,
    toPath
}