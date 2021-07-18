require("colors");

const info = (namespace, message, object) => {
  if (object) {
    console.info(
      `[${getTimeStamp()}] [INFO] [${namespace}] ${message}`.green.bold,
      object
    );
  } else {
    console.info(
      `[${getTimeStamp()}] [INFO] [${namespace}] ${message}`.green.bold
    );
  }
};

const log = (namespace, message, object) => {
  if (object) {
    console.log(
      `[${getTimeStamp()}] [LOG] [${namespace}] ${message}`.green.bold,
      object
    );
  } else {
    console.log(
      `[${getTimeStamp()}] [LOG] [${namespace}] ${message}`.green.bold
    );
  }
};

const warn = (namespace, message, object) => {
  if (object) {
    console.warn(
      `[${getTimeStamp()}] [WARN] [${namespace}] ${message}`.yellow.underline,
      object
    );
  } else {
    console.warn(
      `[${getTimeStamp()}] [WARN] [${namespace}] ${message}`.yellow.underline
    );
  }
};

const error = (namespace, message, object) => {
  if (object) {
    console.error(
      `[${getTimeStamp()}] [ERROR] [${namespace}] ${message}`.red.bold,
      object
    );
  } else {
    console.error(
      `[${getTimeStamp()}] [ERROR] [${namespace}] ${message}`.red.bold
    );
  }
};

const debug = (namespace, message, object) => {
  if (object) {
    console.debug(
      `[${getTimeStamp()}] [DEBUG] [${namespace}] ${message}`.cyan.bold,
      object
    );
  } else {
    console.debug(
      `[${getTimeStamp()}] [DEBUG] [${namespace}] ${message}`.cyan.bold
    );
  }
};

const getTimeStamp = () => {
  return new Date().toLocaleString();
};

module.exports = { info, warn, error, debug, log };
