require("dotenv").config();
const express = require("express");
const userRouter = require("./routers/userRouter");
const authRouter = require("./routers/authRouter");
const path = require("path");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errHandler");
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

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS
// app.use(
//   cors({
//     origin: [
//       "http://localhost:3000",
//       "http://localhost:3001",
//       "http://localhost:3002",
//     ],
//     credentials: true,
//   })
// );

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);

// Static Pages
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));
  app.use("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
} else {
  app.use("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
  });
}

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
http.listen(PORT, () =>
  console.log(
    `Server running on ${process.env.NODE_ENV} mode in PORT ${PORT}`.yellow.bold
  )
);
