
var axios = require("axios");
var fs = require("fs");
var reader = require('filereader')
// const JSON = require('circular-json');
// const FileDownload = require('js-file-download');
var db = require("../models");

// var IPaddress = "184.171.246.58";
var IPaddress = "10.0.20.228";
var scenarioFolderPathname;
var scenarioFilenames = ['Resource Classes.txt',
                         'Model Parameters.txt',
                         'Pools.txt',
                         'Process Route.txt',
                         'Resource Requirement Expressions.txt',
                         'Resources.txt'];

const c_ExtendSimModelPath = "C:/Users/Administrator/Documents/ExtendSim10ASP_Prod/ASP/ASP Servers/ExtendSim Models/ASP example model (GS).mox"

function ExtendSimASP_login(username, password, login_callback, res) {  
    // var queryURL = "http://" + IPaddress + ":8090/StreamingService/web/LoginToServer?username=" + username + "&password=" + password;
    // var queryURL = "http://10.0.20.228:8090/StreamingService/web/LoginToServer?username=" + username + "&password=" + password;
    var queryURL = "http://" + IPaddress + ":8090/StreamingService/web/LoginToServer";
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
        db.scenario.create({
            userLoginSessionID: response.data,
            username: username,
            scenarioID: null,
            scenarioSubmissionDataTime: null,
            scenarioCompletionDataTime: null
        }).then(function(dbTodo) {
                // We have access to the new todo as an argument inside of the callback function
            res.json(response.data);
        });
        // res.json(response.data);
    });
}
function ExtendSimASP_createScenarioFolder(myScenarioFolder, createScenarioFolder_callback, res) {
    // Execute WCF service to create a scenario folder  
    // var queryURL = "http://" + IPaddress + ":8090/StreamingService/web/CreateScenarioFolder?scenarioFoldername=myScenarioFolder"
    var queryURL = "http://" + IPaddress + ":8090/StreamingService/web/CreateScenarioFolder"
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
        var queryURL = "http://" + IPaddress + ":8090/StreamingService/web/CopyModelToScenarioFolder";
    // var queryURL = "http://" + IPaddress + ":8090/StreamingService/web/CopyModelToScenarioFolder?modelPathname=" + 
    //     encodeURIComponent(c_ExtendSimModelPath) + 
    //      "&scenarioFolderpath=" + encodeURIComponent(scenarioFolderPathname) + "&copyFolderContents=True";  
    console.log('ExtendSimASP_copyModelToScenarioFolder: url=' + queryURL + " modelName=" + modelPathname + " scenario pathname=" + scenarioFolderPathname);
    axios({
        url: queryURL,
        method: 'post',
        accept: 'application/json',
        contentType: 'application/json;charset=utf-8',
        headers: myheaders,
        muteHttpExceptions : false,
        params: {
            modelPathname : modelPathname,
            scenarioFolderpath: scenarioFolderPathname,
            copyFolderContents: copyFolderContents
        }
    }).then(function(response) {
        console.log('ExtendSimASP_copyModelToScenarioFolder: ' + response.data);   
        // copyModelToScenarioFolder_callback(scenarioFolderPathname, scenarioFilenames);
    });
}
function ExtendSimASP_sendFile(scenarioFolderPathname, filename, filedata) {
    var myheaders = { 
        accept: "application/json", 
    };     
    var queryURL =  "http://" + IPaddress + ":8090/StreamingService/web/UploadPathname?filepathname=" + encodeURIComponent(scenarioFolderPathname + "/" + filename);
    console.log("ExtendSimASP_sendFile - send filename for scenarioFolderPathname=" + scenarioFolderPathname);
    return axios({
        url: queryURL,
        method: 'post',
        accept : "application/json",
        contentType: "application/json;charset=utf-8",
        headers : myheaders,
        muteHttpExceptions : false
    }).then(function(response) {
        console.log("ExtendSimASP_sendFile - send filedata =" + filedata);
        var queryURL =  "http://" + IPaddress + ":8090/StreamingService/web/UploadStream"
        return axios({
            url: queryURL,
            method: 'post',
            accept : 'application/json',
            //    contentType: 'application/json;charset=utf-8',
            contentType: 'multipart/form-data',
            headers : myheaders,
            data: filedata,
            //    payload : result,
            muteHttpExceptions : false
        })
    });
}

// Execute WCF service to submit the simulation scenario
function ExtendSimSubmitScenario(userLoginSessionID, modelPathname, removeFolderOnCompletion) {
    var myheaders = { 
        accept: "application/json", 
    };     
    var scenarioID;
    var queryURL = "http://" + IPaddress + ":8080/ExtendSimService/web/SubmitSimulationScenario_TF";
    return axios({
        url: queryURL,
        method: 'post',
        accept : "application/json",
        contentType: "application/json;charset=utf-8",
        headers : myheaders,
        muteHttpExceptions : false,
        params: 
        {
            userLoginSession_ID: userLoginSessionID,
            modelPathname: modelPathname,
            removeScenarioFolderOnCompletion: removeFolderOnCompletion
        }
    }).then(function(response) {
        scenarioID = response.data;
        // ExtendSimCheckModelRunStatus(userLoginSessionID);
        console.log("ExtendSimSubmitScenario: response.data=" + response.data);
        // update the user's scenario ID and submission time in the database
        return db.scenario.update({
            scenarioID: response.data,
            scenarioSubmissionDataTime: new Date(),
        }, {
            where: {
                userLoginSessionID: userLoginSessionID
            }
        }).then(function(dbresponse) {
            return scenarioID;     
        });
        // return scenarioID;     
        // return response.data;     
    });
}
function ExtendSimCheckModelRunStatus(scenarioID) {
    var myheaders = { 
        accept: "application/json", 
    };
    var queryURL = "http://" + IPaddress + ":8080/ExtendSimService/web/CheckModelRunStatus";
//     while (runStatus < 3) {
//       //Browser.msgBox("Run status=" + runStatus);
//       Utilities.sleep(1000)
//      runStatus = UrlFetchApp.fetch(url_checkModelRunStatus, options6).getContentText();
//    }
    console.log("ExtendSimCheckModelRunStatus: Making call to server...");
    return axios({
        url: queryURL,
        method: 'get',
        accept : "application/json",
        contentType: "application/json;charset=utf-8",
        headers : myheaders,
        muteHttpExceptions : false,
        params: 
        {
            scenario_ID: scenarioID
        }
    }).then(function(response) {
        var modelRunStatus = response.data;
        console.log("ExtendSimCheckModelRunStatus: Model run status=" + modelRunStatus);
        return modelRunStatus;
        // ExtendSimCheckModelRunStatus(userLoginSessionID);
    });
}

function ExtendSimASPgetScenarioResults(filepathname, userLoginSessionID) {
    var queryURL = "http://" + IPaddress + ":8090/StreamingService/web/GetServerFileStream";
    var myheaders = { 
        accept: "application/json", 
        }; 
    var scenarioResults;
    console.log("ExtendSimASPgetScenarioResults: Getting scenario results from server...");
    return axios({
        url: queryURL,
        method: 'post',
        accept : "application/json",
        // contentType: "application/octet-stream",
        responseType: "blob",
        headers : myheaders,
        muteHttpExceptions : false,
        params: 
        {
            filename: filepathname
        }
    }).then(function(response) {
        scenarioResults = response.data;
        console.log("ExtendSimASPgetScenarioResults: response=" + response.data);
        return db.scenario.update({
            scenarioCompletionDataTime: new Date(),
        }, {
            where: {
                userLoginSessionID: userLoginSessionID
            }
        }).then(function(dbresponse) {
            reader.onloadend = function(evt) {
                if (evt.target.readyState == FileReader.DONE) {           
                //   var textArr = evt.target.result.split(/\r\n|\r|\n/g);
                //   console.log(textArr);
                console.log("Reader result=" + evt.target.result);
                }
            };
            // reader.readAsText(scenarioResults);
            // reader.readAsBinaryString(scenarioResults);
            var myResult = JSON.stringify(scenarioResults);
            console.log("MyResult=" + myResult);
            var textArr = myResult.split(/\r\n|\r|\n/g);
            console.log("textArr.length =" + textArr.length);
            splitArray = scenarioResults.split('\r\n').map(function(ln){
                return ln.split('\t');
            });
            console.log("splitArray.length =" + splitArray.length);
            splitArray.forEach(function(element) {
                console.log("element=" + element);
            });
            // console.log("splitArray =" + splitArray);
            

            return scenarioResults;     
        });
        // return response.data;
    });
}
function responseCallback(textData, res) {
    console.log("responseCallback: textData=" + textData);
    res.json(textData);
};

function convertBlobToText(blobData, callback, res) {
    const reader = new FileReader();
    reader.onload = function(event) {
        console.log("convertBlobToText: result=" + reader.result);
        callback(reader.result, res)
    };  
    reader.readAsText(blobData);
  };
  
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
    ExtendSimASP_sendFile(req.query.scenarioFolderPathname, req.query.filename, req.query.filedata, req, res)
    .then(function(result) {
        res.json(req.query.filedata);
    });
});
app.get("/api/sendfiledata", function(req, res) {
    console.log("Route /api/sendfilesdata: req.query=" + req.body);
    res.json(req.body);
});
app.get("/api/submitsimulationscenario", function(req, res) {
    console.log("Route /api/submitsimulationscenario: userLoginSessionID=" + req.query.userLoginSessionID);
    ExtendSimSubmitScenario(req.query.userLoginSessionID, req.query.modelPathname, req.query.removeFolderOnCompletion)
    .then(function(scenarioID) {
        res.json(scenarioID);
    });
});
app.get("/api/checkmodelrunstatus", function(req, res) {
    console.log("Route /api/checkmodelrunstatus: userLoginSessionID=" + req.query.scenarioID);
    ExtendSimCheckModelRunStatus(req.query.scenarioID)
    .then(function(modelRunStatus) {
        res.json(modelRunStatus);
    });
});   

app.get("/api/getscenarioresults", function(req, res) {
    console.log("Route /api/getscenarioresults: filepath=" + req.query.filepath + " userLoginSessionID=" + req.query.userLoginSessionID);
    ExtendSimASPgetScenarioResults(req.query.filepath, req.query.userLoginSessionID)
    .then(function(result) {
        console.log("Route /api/getscenarioresults: result=" + result);
        res.json(result);
    });
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


};

