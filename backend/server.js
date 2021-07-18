const express = require("express");
const path = require("path");
const connectDB = require("./config/db");
const morgan = require("morgan");
const app = express();
const http = require("http").createServer(app);
const config = require("./config/default");
const logger = require("./config/logger");
require("./socketIo/")(http);
require("colors");

const NAMESPACE = "Server"

// Mongoose Connection
connectDB();

// Middleware
if (config.server.node_env === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  /** Log the req */
  logger.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

  res.on('finish', () => {
      /** Log the res */
      logger.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
  });

  next();
});

// Static Pages
if (config.server.node_env === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build/")));
  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
  });
} else {
  app.use("/", (req, res) => {
    res.send(`Welcome to server ${process.env.SERVER_URL}`);
  });
}

http.listen(config.server.port, () =>
  logger.info(
    NAMESPACE,
    `Server running on ${config.server.node_env} mode in PORT ${config.server.port}`
  )
);
