
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
    var queryURL = "http://184.171.246.58:8090/StreamingService/web/LoginToServer";
    // var queryURL = "http://10.0.20.228:8090/StreamingService/web/LoginToServer";

    myMethod = "POST"   
    var myheaders = { 
              accept: "application/json", 
      }; 
    
    var options_textPOST = {method : "POST",
                  accept : "application/json",
                  contentType: "application/json;charset=utf-8",
                  headers : myheaders,
                  muteHttpExceptions : false};
    console.log('ExtendSimASP_login entry. Logging into host ' + queryURL + " for username=" + username + " password=" + password);
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
    });
}
function ExtendSimASP_createScenarioFolder(myScenarioFolder, createScenarioFolder_callback, res) {
    // Execute WCF service to create a scenario folder  
    // var queryURL = "http://184.171.246.58:8090/StreamingService/web/CreateScenarioFolder?scenarioFoldername=myScenarioFolder"
    var queryURL = "http://184.171.246.58:8090/StreamingService/web/CreateScenarioFolder"
    var myheaders = { 
        accept: "application/json", 
    }; 
    var options1 = {method : "GET",
                accept : "application/json",
                contentType: "application/json;charset=utf-8",
                headers : myheaders,
                muteHttpExceptions : false};
    
    //  var response = UrlFetchApp.fetch(url_createScenarioFolder, options1).getContentText()
    console.log("Creating scenario folder for " + myScenarioFolder);
    axios({
        url: queryURL,
        method: 'get',
        accept : 'application/json',
        contentType: 'application/json;charset=utf-8',
        headers : myheaders,
        muteHttpExceptions : false,
        params : {
            scenarioFoldername : myScenarioFolder
        }
    }).then(function(response) {
        console.log('ExtendSimASP_createScenarioFolder: ' + response.data);
        scenarioFolderPathname = response.data;
        // createScenarioFolder_callback(modelPathname, scenarioFolderPathname, copyFolderContents, ExtendSimASP_sendFile);
        res.json(scenarioFolderPathname);
    });
}
function ExtendSimASP_copyModelToScenarioFolder(modelPathname, scenarioFolderPathname, copyFolderContents, copyModelToScenarioFolder_callback) {
      // Execute WCF service to copy the model folder to the scenario folder 
    var myheaders = { 
        accept: "application/json", 
    };
    var options2 = {method : "POST",
        accept : "application/json",
        contentType: "application/json;charset=utf-8",
        headers : myheaders,
        muteHttpExceptions : false};
        var queryURL = "http://184.171.246.58:8090/StreamingService/web/CopyModelToScenarioFolder";
    // var queryURL = "http://184.171.246.58:8090/StreamingService/web/CopyModelToScenarioFolder?modelPathname=" + 
    //     encodeURIComponent(c_ExtendSimModelPath) + 
    //      "&scenarioFolderpath=" + encodeURIComponent(scenarioFolderPathname) + "&copyFolderContents=True";  
    console.log('ExtendSimASP_copyModelToScenarioFolder: url=' + queryURL + " modelName=" + modelPathname + " scenario pathname=" + scenarioFolderPathname);
    axios({
        url: queryURL,
        method: 'post',
        accept : 'application/json',
        contentType: 'application/json;charset=utf-8',
        headers : myheaders,
        muteHttpExceptions : false,
        params : {
            modelPathname : modelPathname,
            scenarioFolderpath : scenarioFolderPathname,
            copyFolderContents : copyFolderContents
        }
    }).then(function(response) {
        console.log('ExtendSimASP_copyModelToScenarioFolder: ' + response.data);   
        // copyModelToScenarioFolder_callback(scenarioFolderPathname, scenarioFilenames);
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
// ROUTES
// User login route
  app.get("/api/login/:username&:password", function(req, res) {
    console.log("Username=" + req.params.username + " password=" + req.params.password);
    console.log("Res= " + res);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    ExtendSimASP_login(req.params.username, req.params.password, ExtendSimASP_createScenarioFolder, res);
  });

//  Create scenario folder route
app.get("/api/createscenariofolder/:scenarioFolderName", function(req, res) {
    console.log("Scenario folder name=" + req.params.scenarioFolderName);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    ExtendSimASP_createScenarioFolder(req.params.scenarioFolderName, ExtendSimASP_copyModelToScenarioFolder, res);
});
// app.get("/api/copymodeltoscenariofolder/:modelPathname&:scenarioFolderPathname&:copyFolderContents", function(req, res) {
// app.get("/api/copymodeltoscenariofolder/modelPathname=:modelPathname&:scenarioFolderPathname=scenarioFolderPathname&copyFolderContents=:copyFolderContents", function(req, res) {
app.get("/api/copymodeltoscenariofolder", function(req, res) {
        console.log("Successfully got to route /api/copymodeltoscenariofolder - req.query.modelPathname =" + req.query.modelPathname);
    ExtendSimASP_copyModelToScenarioFolder(req.query.modelPathname, req.query.scenarioFolderPathname, req.query.copyFolderContents, ExtendSimASP_sendFile);
    res.json(req.query.modelPathname);
});
app.get("/api/copymodeltoscenariofolder2/modelPathname=:modelPathname&:scenarioFolderPathname=scenarioFolderPathname&copyFolderContents=:copyFolderContents", function(req, res) {
    console.log("Successfully got to route /api/copymodeltoscenariofolder2");
    // ExtendSimASP_copyModelToScenarioFolder(res.params.modelPathname, req.params.scenarioFolderPathname, req.params.copyFolderContents, ExtendSimASP_sendFile);
    res.json(req.params.scenarioFolderPathname);
});

app.get("/api/sendfilename", function(req, res) {
    console.log("Route /api/sendfilesdata: req.query.filedata=" + req.query.filedata);
    res.json(req.query.filedata);
});
app.get("/api/sendfiledata", function(req, res) {
    console.log("Route /api/sendfilesdata: req.query=" + req.body);
    res.json(req.body);
});

//  Create scenario folder route
app.post("/api/copymodeltoscenariofolder", function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    console.log("Successfully got to POST route /api/copymodeltoscenariofolder - req.query.modelPathname =" + req.query.modelPathname);
// ExtendSimASP_copyModelToScenarioFolder(req.params.modelPathname, req.params.scenarioFolderPathname, req.params.copyFolderContents, ExtendSimASP_sendFile);
res.json(req.query.modelPathname);
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

