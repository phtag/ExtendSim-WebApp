var axios = require("axios");
var fs = require("fs");

var c_ExtendSimModelPath =
  "C:/Users/Administrator/Documents/ExtendSim10ASP_Prod/ASP/ASP Servers/ExtendSim Models/ASP example model (GS).mox";
var scenarioFilenames = [
  "Resource Classes.txt",
  "Model Parameters.txt",
  "Pools.txt",
  "Process Route.txt",
  "Resource Requirement Expressions.txt",
  "Resources.txt"];
];

function ExtendSimASP_login(login_callback) {
  var queryURL = "http://184.171.246.58:8090/StreamingService/web/LoginToServer?username=admin&password=model";
  // var queryURL = "http://184.171.246.58:8090/StreamingService/web/LoginToServer";

  myMethod = "POST";   
  var myheaders = { 
    accept: "application/json", 
  }; 

  var options_textPOST = {method : "POST",
    accept : "application/json",
    contentType: "application/json;charset=utf-8",
    headers : myheaders,
    muteHttpExceptions : false};
  console.log("Give this a whirl");
  axios({
    url: queryURL,
    method: "post",
    accept : "application/json",
    contentType: "application/json;charset=utf-8",
    headers : myheaders,
    data: {
      username: "admin",
      password: "model"
    }
  }).then(function(response) {
    console.log("ExtendSimASP_login: " + response.data);
    login_callback(ExtendSimASP_copyModelToScenarioFolder);
  });
}
function ExtendSimASP_createScenarioFolder(createScenarioFolder_callback) {
  // Execute WCF service to create a scenario folder  
  var queryURL = "http://184.171.246.58:8090/StreamingService/web/CreateScenarioFolder?scenarioFoldername=myScenarioFolder";
  var myheaders = { 
    accept: "application/json", 
  }; 

  var options1 = {method : "GET",
    accept : "application/json",
    contentType: "application/json;charset=utf-8",
    headers : myheaders,
    muteHttpExceptions : false};

  //  var response = UrlFetchApp.fetch(url_createScenarioFolder, options1).getContentText()
  axios({
    url: queryURL,
    method: "get",
    accept : "application/json",
    contentType: "application/json;charset=utf-8",
    headers : myheaders,
    muteHttpExceptions : false
  }).then(function(response) {
    console.log("ExtendSimASP_createScenarioFolder: " + response.data);
    scenarioFolderPathname = response.data;
    createScenarioFolder_callback(response.data, ExtendSimASP_sendFile);
  });
}
function ExtendSimASP_copyModelToScenarioFolder(
  scenarioFolderPathname,
  copyModelToScenarioFolder_callback
) {
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
    "&scenarioFolderpath=" +
    encodeURIComponent(scenarioFolderPathname) +
    "&copyFolderContents=True";
  // console.log('ExtendSimASP_copyModelToScenarioFolder: url=' + queryURL);
  axios({
    url: queryURL,
    method: "post",
    accept : "application/json",
    contentType: "application/json;charset=utf-8",
    headers : myheaders,
    muteHttpExceptions : false
  }).then(function(response) {
    console.log("ExtendSimASP_copyModelToScenarioFolder: " + response.data);            
    copyModelToScenarioFolder_callback(scenarioFolderPathname, scenarioFilenames);
  );
  });
}
function ExtendSimASP_sendFile(scenarioFolderPathname, filenames) {
  filenames.forEach(function(filename) {
    fs.readFile(filename, "utf8", function(error, result) {
      if (error) {
        console.log("Error" + error);
      }
      console.log("Result=" + result);
      var myheaders = { 
        accept: "application/json", 
      };  

      var queryURL = "http://184.171.246.58:8090/StreamingService/web/UploadPathname?filepathname=" + encodeURIComponent(scenarioFolderPathname + "/" + filename);
      axios({
        url: queryURL,
        method: "post",
        accept : "application/json",
        contentType: "application/json;charset=utf-8",
        headers : myheaders,
        muteHttpExceptions : false
      }).then(function(response) {
        console.log("Uploaded pathname...");
        var queryURL = "http://184.171.246.58:8090/StreamingService/web/UploadStream";
        axios({
          url: queryURL,
          method: "post",
          accept : "application/json",
          //    contentType: 'application/json;charset=utf-8',
          contentType: "multipart/form-data",
          headers : myheaders,
          data: result,
          //    payload : result,
          muteHttpExceptions : false
        }).then(function(response) {
          console.log("ExtendSimASP_sendFile: " + response.data);
        });   
      }); 
    });
  });
}

ExtendSimASP_login(ExtendSimASP_createScenarioFolder);
