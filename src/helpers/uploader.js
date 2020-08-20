// IDEA: maybe later use AWS s3 or something else

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

async function upload(dirName, fileName, data) {
    const path = toPath(dirName + sep + fileName);
    const dir = dirName ? toPath(dirName) : uploadDir;

    try {
        await fs.promises.access(dir);
    } catch (err) {
        await fs.promises.mkdir(dir, { recursive: true })
    }

    await fs.promises.writeFile(path, data)
    return path
}

module.exports = {
    uploadDir,
    upload,
    toPath
}