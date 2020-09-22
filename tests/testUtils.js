const mongoose = require('mongoose');

module.exports = {
    initDatabase,
    closeDatabase,
    deleteUploadsDirectory
}

async function initDatabase(identifier) {
    const url = `mongodb://127.0.0.1/loyalty-${identifier}-test`;
    await mongoose.connect(url, {
        autoIndex: false,
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    });
    await mongoose.connection.db.dropDatabase();
}

function closeDatabase() {
    mongoose.connection.close();
}

function deleteUploadsDirectory(dir) {
    const uploadDir = dir || require('../src/helpers/uploader').uploadDir;

    const fs = require('fs');
    const files = fs.readdirSync(uploadDir);
    files.forEach(file => {
        const curPath = uploadDir + '/' + file;
        if (fs.lstatSync(curPath).isDirectory()) {
            deleteUploadsDirectory(curPath)
        } else {
            fs.unlinkSync(curPath);
        }
    });

    dir && fs.rmdirSync(dir);
}