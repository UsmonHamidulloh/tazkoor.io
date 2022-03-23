require("./modules/collector");

const express = require("express");
const cookie = require("cookie-parser");
const fileUpload = require("express-fileupload");
const authCheck = require("./middleware/token_checker");
const auth = require("./middleware/auth");

const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", req.headers.origin);

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  next();
});

app.use(require("cors")());
app.use(express.json());
app.use(cookie());
app.use(fileUpload());

app.disable("x-powered-by");

app.use(authCheck);
app.use(auth);

app.use("/", require("./modules/routes"));

module.exports = app;
