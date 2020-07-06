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

function deleteUploadsDirectory(maxFiles) {
    const { uploadDir } = require('../src/helpers/uploader');

    const fs = require('fs');
    const files = fs.readdirSync(uploadDir);
    if (files.length > maxFiles) {
        console.log(`Warning: not deleting upload directory ${uploadDir} because it has more files than expected ${maxFiles}`)
    } else {
        files.forEach(file => {
            fs.unlinkSync(uploadDir + '/' + file);
        });
        fs.rmdirSync(uploadDir);
    }
}