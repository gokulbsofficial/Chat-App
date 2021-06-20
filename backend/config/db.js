const moongose = require("mongoose")

const ConnectDB = async () => {
    try {
        let conn = await moongose.connect(`${process.env.MONGO_URL}/${process.env.DB_NAME}`, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        console.log(`MongoDb Connected in ${process.env.DB_NAME .bold} database at ${conn.connection.host .bold}:${conn.connection.port} `.cyan.underline);
    } catch (error) {
        console.error(`Error : ${error.message}`.red.underline.bold);
        process.exit(1)
    }
}

module.exports = ConnectDB;