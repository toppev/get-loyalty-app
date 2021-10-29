import mongoose from "mongoose"

export {
  initDatabase,
  closeDatabase,
  sleep
}

async function initDatabase(identifier) {
  const url = `mongodb://127.0.0.1/loyalty-${identifier}-test`
  await mongoose.connect(url, {
    autoIndex: false,
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  await mongoose.connection.db.dropDatabase()
}

function closeDatabase() {
  mongoose.connection.close()
}

function sleep(millis) {
  return new Promise(resolve => setTimeout(resolve, millis))
}
