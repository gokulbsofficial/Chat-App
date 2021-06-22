require("dotenv").config();
const express = require("express");
const path = require("path");
const connectDB = require("./config/db");
const morgan = require("morgan");
const app = express();
const http = require("http").createServer(app);
require("./socketIo/")(http);
require("colors");

// Mongoose Connection
connectDB();

// Middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static Pages
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));
  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
  });
} else {
  app.use("/", (req, res) => {
    res.send(`Welcome to server ${process.env.SERVER_URL}`);
  });
}

const PORT = process.env.PORT || 5000;

http.listen(PORT, () =>
  console.log(
    `Server running on ${process.env.NODE_ENV} mode in PORT ${PORT}`.yellow.bold
  )
);
