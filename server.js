require("dotenv").config();
var express = require("express");
var exphbs = require("express-handlebars");

var db = require("./models");

var app = express();
var HOST = process.env.HOST || "127.0.0.1";
// var HOST = process.env.HOST || "localhost";
var PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
var cors = require("cors");
// Then use it before your routes are set up:
app.use(cors());

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Routes
require("./routes/apiRoutes_ExtendSim")(app);
require("./routes/htmlRoutes")(app);

var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function() {
  app.listen(PORT, HOST, function() {
    console.log(
      "==> 🌎  Listening on host %s port %s. Visit http://localhost:%s/ in your browser.",
      HOST,
      PORT,
      PORT
    );
  });
});

module.exports = app;
