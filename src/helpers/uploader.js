// IDEA: maybe later use AWS s3 or somethin else

const fs = require('fs');
const sep = '/'; // const { sep } require('path'); doesn't really work as well with express (or something) (even on Windows)

const uploadDir = process.env.UPLOAD_DIR || process.env.PWD.concat(`${sep}uploads`);
console.log(`Upload dir: ${uploadDir}`);
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

/**
 * Returns the file path of the file.
 * e.g /uploads/${fileName}
 */
function toPath(fileName) {
    return uploadDir + sep + fileName;
}

async function upload(fileName, data) {
    const path = toPath(fileName);
    fs.writeFile(path, data, function (err) {
        if (err) {
            throw err;
        }
        // Success
    });
    return path
}

module.exports = {
    uploadDir,
    upload,
    toPath
}