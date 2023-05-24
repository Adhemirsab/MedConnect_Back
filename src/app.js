const express = require("express");

require("dotenv").config();
const passportSetup = require("./config/passport");
const passport = require("passport");
const { createServer } = require("http");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");

const { router } = require("./routes/router.js");

const app = express();
const httpServer = createServer(app);

app.use(
  cookieSession({
    name: "session",
    keys: [process.env.JWT_SECRET],
    maxAge: 24 * 60 * 60 * 100,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

//express vars
app.set("port", process.env.PORT);

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require("morgan")("dev"));
// app.use(
//   require("cors")({
//     origin: "*",
//   })
// );
app.use(
  require("cors")({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.static("./src/storage"));

app.use("/", router);

app.use(function (err, req, res, next) {
  res.status(500).json(err);
});

module.exports = {
  httpServer,
  app,
};
