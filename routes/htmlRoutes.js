var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    res.render("login");
  });

  app.get("/scenarioinputs", function(req, res) {
    console.log("Rendering scenario-inputs page");
    res.render("scenario-inputs", { userLoginID: req.query.userLoginID });
  });

  // Load example page and pass in an example by id
  // app.get("/displaytable", function(req, res) {
  //   // db.cycletime.findOne({ where: { id: req.params.id } }).then(function(dbExample) {
  //   //   res.render("cycletime", {
  //   //     example: dbExample
  //   //   });
  //   });
  // });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
