
var axios = require("axios");
var fs = require("fs");

var scenarioFolderPathname;
var scenarioFilenames = ['Resource Classes.txt',
                         'Model Parameters.txt',
                         'Pools.txt',
                         'Process Route.txt',
                         'Resource Requirement Expressions.txt',
                         'Resources.txt'];

const c_ExtendSimModelPath = "C:/Users/Administrator/Documents/ExtendSim10ASP_Prod/ASP/ASP Servers/ExtendSim Models/ASP example model (GS).mox"

function ExtendSimASP_login(username, password, login_callback, res) {

    
    // var queryURL = "http://184.171.246.58:8090/StreamingService/web/LoginToServer?username=" + username + "&password=" + password;
    // var queryURL = "http://10.0.20.228:8090/StreamingService/web/LoginToServer?username=" + username + "&password=" + password;
    // var queryURL = "http://184.171.246.58:8090/StreamingService/web/LoginToServer";
    var queryURL = "http://10.0.20.228:8090/StreamingService/web/LoginToServer";

    myMethod = "POST"   
    var myheaders = { 
              accept: "application/json", 
      }; 
    
    var options_textPOST = {method : "POST",
                  accept : "application/json",
                  contentType: "application/json;charset=utf-8",
                  headers : myheaders,
                  muteHttpExceptions : false};
    console.log('ExtendSimASP_login entry. Logging into host ' + queryURL);
    axios({
        url: queryURL,
        method: 'post',
        accept : 'application/json',
        contentType: 'application/json;charset=utf-8',
        headers : myheaders,
        params: {
            username: username,
            password: password
        }
      }).then(function(response) {
          console.log('ExtendSimASP_login: ' + response.data);
          res.json(response.data);
        //   login_callback(ExtendSimASP_copyModelToScenarioFolder);
    });
}
function ExtendSimASP_createScenarioFolder(myScenarioFolder, createScenarioFolder_callback, res) {
    // Execute WCF service to create a scenario folder  
    var queryURL = "http://184.171.246.58:8090/StreamingService/web/CreateScenarioFolder?scenarioFoldername=myScenarioFolder"
    var myheaders = { 
        accept: "application/json", 
    }; 
    
    var options1 = {method : "GET",
                accept : "application/json",
                contentType: "application/json;charset=utf-8",
                headers : myheaders,
                muteHttpExceptions : false};
    
    //  var response = UrlFetchApp.fetch(url_createScenarioFolder, options1).getContentText()
    console.log("Creating scenarion folder for " + myScenarioFolder);
    axios({
        url: queryURL,
        method: 'get',
        accept : 'application/json',
        contentType: 'application/json;charset=utf-8',
        headers : myheaders,
        muteHttpExceptions : false
    }).then(function(response) {
        console.log('ExtendSimASP_createScenarioFolder: ' + response.data);
        scenarioFolderPathname = response.data;
        res.json(scenarioFolderPathname);
        // createScenarioFolder_callback(response.data, ExtendSimASP_sendFile);
    });
}
function ExtendSimASP_copyModelToScenarioFolder(scenarioFolderPathname, copyModelToScenarioFolder_callback) {
      // Execute WCF service to copy the model folder to the scenario folder 
    var myheaders = { 
        accept: "application/json", 
    };
    var options2 = {method : "POST",
        accept : "application/json",
        contentType: "application/json;charset=utf-8",
        headers : myheaders,
        muteHttpExceptions : false};
    var queryURL = "http://184.171.246.58:8090/StreamingService/web/CopyModelToScenarioFolder?modelPathname=" + 
        encodeURIComponent(c_ExtendSimModelPath) + 
         "&scenarioFolderpath=" + encodeURIComponent(scenarioFolderPathname) + "&copyFolderContents=True";  
    // console.log('ExtendSimASP_copyModelToScenarioFolder: url=' + queryURL);
    axios({
        url: queryURL,
        method: 'post',
        accept : 'application/json',
        contentType: 'application/json;charset=utf-8',
        headers : myheaders,
        muteHttpExceptions : false
    }).then(function(response) {
        console.log('ExtendSimASP_copyModelToScenarioFolder: ' + response.data);            
        copyModelToScenarioFolder_callback(scenarioFolderPathname, scenarioFilenames);
    });

}
function ExtendSimASP_sendFile(scenarioFolderPathname, filenames) {
    filenames.forEach(function(filename) {
        fs.readFile(filename, 'utf8', function(error, result) {
            if (error) {
                console.log('Error' + error);
            }
            console.log('Result=' + result);
            var myheaders = { 
                accept: "application/json", 
            };  
            
            var queryURL =  "http://184.171.246.58:8090/StreamingService/web/UploadPathname?filepathname=" + encodeURIComponent(scenarioFolderPathname + "/" + filename);
            axios({
                url: queryURL,
                method: 'post',
                accept : "application/json",
                contentType: "application/json;charset=utf-8",
                headers : myheaders,
                muteHttpExceptions : false
            }).then(function(response) {
                console.log('Uploaded pathname...');
                var queryURL =  "http://184.171.246.58:8090/StreamingService/web/UploadStream"
                axios({
                url: queryURL,
                method: 'post',
                accept : 'application/json',
                //    contentType: 'application/json;charset=utf-8',
                contentType: 'multipart/form-data',
                headers : myheaders,
                data: result,
                //    payload : result,
                muteHttpExceptions : false
            }).then(function(response) {
                console.log('ExtendSimASP_sendFile: ' + response.data);
            });   
            }); 
        })
    });
}

// ExtendSimASP_login(ExtendSimASP_createScenarioFolder);

var db = require("../models");

module.exports = function(app) {
  // Login
  app.get("/api/login/:username&:password", function(req, res) {
    console.log("Username=" + req.params.username + " password=" + req.params.password);
    console.log("Res= " + res);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    ExtendSimASP_login(req.params.username, req.params.password, ExtendSimASP_createScenarioFolder, res);
    // db.Example.findAll({}).then(function(dbExamples) {
    //   res.json(dbExamples);
    // });
  });

  

  app.get("/api/createscenariofolder/:scenarioFolderName", function(req, res) {
    console.log("Scenario folder name=" + req.params.scenarioFolderName);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    ExtendSimASP_createScenarioFolder(req.params.scenarioFolderName, ExtendSimASP_copyModelToScenarioFolder, res);
    // db.Example.findAll({}).then(function(dbExamples) {
    //   res.json(dbExamples);
    // });
  });


  // Create a new example
  app.post("/api/examples", function(req, res) {
    db.Example.create(req.body).then(function(dbExample) {
      res.json(dbExample);
    });
  });

  // Delete an example by id
  app.delete("/api/examples/:id", function(req, res) {
    db.Example.destroy({ where: { id: req.params.id } }).then(function(dbExample) {
      res.json(dbExample);
    });
  });
};

