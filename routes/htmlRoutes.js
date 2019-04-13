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

  app.get("/showresults", function(req, res) {
    console.log("Servicing /showresults route...");
    db.cycletime.findAll().then(function(queryResults) {
      res.render("cycletime", { cycleTimeData: queryResults });
    });
  });
  // db.cycletime.findAll({ where: { id: req.params.id } }).then(function(dbExample) {
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
