const moongose = require("mongoose");
const config = require("./default");
const logging = require("./logger");

const NAMESPACES = "Mongo";

const ConnectDB = async () => {
  try {
    let conn = await moongose.connect(
      `${config.mongo.url}`,
      config.mongo.options
    );
    logging.info(
      NAMESPACES,
      `MongoDb Connected in ${conn.connection.name} database at ${conn.connection.host.bold}:${conn.connection.port} `
    );
  } catch (error) {
    logging.error(NAMESPACES, error.message, error);
    process.exit(1);
  }
};

module.exports = ConnectDB;
