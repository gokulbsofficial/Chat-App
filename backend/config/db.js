const moongose = require("mongoose")

const ConnectDB = async () => {
    try {
        let conn = await moongose.connect(process.env.MONGO_URL, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: true
        })
        console.log(`MongoDb Connected : ${conn.connection.host}`.cyan.underline);
    } catch (error) {
        console.error(`Error : ${error.message}`.red.underline.bold);
        process.exit(1)
    }
}

module.exports = ConnectDB;