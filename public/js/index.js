// var proxyUrl = 'https://cors-anywhere.herokuapp.com/';
var scenarioFolderPathname;
var myheaders = {
  accept: "application/json",
  Methods: "GET, POST, PUT, DELETE"
};
// eslint-disable-next-line no-unused-vars
var myScenarioFolderName = "myProject2_scenario";
// var scenarioFilenames = ['Resource Classes.txt',
//                          'Model Parameters.txt',
//                          'Pools.txt',
//                          'Process Route.txt',
//                          'Resource Requirement Expressions.txt',
//                          'Resources.txt'];
var scenarioInputFiles = [];
var AJAXscenarioInputfiles = [];
var ExtendSimModelName = "/ASP example model (GS).mox";
var ExtendSimModelPath =
  "C:/Users/peter/Documents/ExtendSim10ASP_Prod/ASP/ASP Servers/ExtendSim Models/ASP v10 models" +
  ExtendSimModelName;
// var ExtendSimModelPath =
//   "C:/Users/Administrator/Documents/ExtendSim10ASP_Prod/ASP/ASP Servers/ExtendSim Models" +
//   ExtendSimModelName;
// Get references to page elements
var $submitLoginInfoBtn = $("#submit-login-info");
var $submitSimulationScenarioBtn = $("#submit-simulation-scenario");
var $scenarioName = $("#scenario-name-text");
var $scenarioID = $("#scenario-id");
var $scenarioFolderPathname = $("#scenario-folder-pathname");
var $username = $("#username-text");
var $password = $("#password-text");
// var $dropArea = $("#drop-area");
//  ExtendSim API functions
function ExtendSimASPloginAJAX(username, password, login_callback) {
  // $.get(proxyUrl + targetUrl, function(data) {
  //    console.log(data);
  // });
  // var queryURL = "http://184.171.246.58:8090/StreamingService/web/LoginToServer?username=admin&password=model";
  // var queryURL = "localhost:3000/api/login/admin&model";
  var queryURL = "http://127.0.0.1:3000/api/login/" + username + "&" + password;

  // var queryURL = "http://184.171.246.58:8090/StreamingService/web/LoginToServer";
  // var targetUrl = proxyUrl + queryURL;
  var targetUrl = queryURL;
  $.ajax({
    url: targetUrl,
    method: "get",
    accept: "application/json",
    contentType: "application/json;charset=utf-8",
    headers: myheaders
  }).then(function(response) {
    var scenarioID = response;
    if (scenarioID === "") {
      console.log("ERROR: ExtendSimASPloginAJAX");
    } else {
      $("#scenario-id").val(scenarioID);
      console.log("ExtendSimASPloginAJAX: " + scenarioID);
      // login_callback(ExtendSimASPcopyModelToScenarioFolder);
    }
  });
}

function ExtendSimASPcreateScenarioFolder(myScenarioFolderName) {
  // Execute WCF service to create a scenario folder
  // var queryURL = "http://184.171.246.58:8090/StreamingService/web/CreateScenarioFolder?scenarioFoldername=myScenarioFolder"
  var queryURL =
    "http://127.0.0.1:3000/api/createscenariofolder/" + myScenarioFolderName;
  $.ajax({
    url: queryURL,
    method: "get",
    accept: "application/json",
    contentType: "application/json;charset=utf-8",
    headers: myheaders,
    muteHttpExceptions: false
  }).then(function(response) {
    console.log("ExtendSimASPcreateScenarioFolder: " + response);
    scenarioFolderPathname = response;
    $("#scenario-folder-pathname").val(scenarioFolderPathname);
    ExtendSimASPcopyModelToScenarioFolder(scenarioFolderPathname);
  });
}

function ExtendSimASPcopyModelToScenarioFolder(scenarioFolderPathname) {
  // Execute WCF service to create a scenario folder
  // var queryURL = "http://184.171.246.58:8090/StreamingService/web/CreateScenarioFolder?scenarioFoldername=myScenarioFolder"
  // var queryURL = "http://127.0.0.1:3000/api/copymodeltoscenariofolder/" + encodeURIComponent(ExtendSimModelPath) + "&" + encodeURIComponent(scenarioFolderPathname) + "&" + true;
  var queryURL = "http://127.0.0.1:3000/api/copymodeltoscenariofolder";
  $.ajax({
    url: queryURL,
    method: "get",
    // accept : 'application/json',
    contentType: "application/json;charset=utf-8",
    headers: myheaders,
    muteHttpExceptions: false,
    data: {
      modelPathname: ExtendSimModelPath,
      scenarioFolderPathname: scenarioFolderPathname,
      copyFolderContents: true
    }
  }).then(function(response) {
    console.log("ExtendSimASPcopyModelToScenarioFolder: " + response);
    ExtendSimASPsendFiles(scenarioFolderPathname, AJAXscenarioInputfiles);
  });
}
function sendFile(scenarioFolderPathname, files, fileIndex) {
  var queryNameURL = "http://127.0.0.1:3000/api/sendfilename/";
  var reader = new FileReader();
  reader.onload = function(event) {
    var filename = files[fileIndex].name;
    event.preventDefault();
    // Here you can use `e.target.result` or `this.result`
    // and `f.name`.
    console.log("Reader result=" + reader.result);
    alert("Sending file = " + filename);
    $.ajax({
      url: queryNameURL,
      method: "get",
      accept: "application/json",
      // contentType: "multipart/form-data",
      contentType: "application/json;charset=utf-8",
      headers: myheaders,
      // data: reader.result,
      muteHttpExceptions: false,
      data: {
        scenarioFolderPathname: scenarioFolderPathname,
        filename: filename,
        filedata: reader.result
      }
    }).then(function(response) {
      console.log("Response=" + response);
      fileIndex++;
      if (fileIndex < files.length) {
        sendFile(scenarioFolderPathname, files, fileIndex++);
      } else {
        ExtendSimASPsubmitSimulationScenario(
          $scenarioID.val(),
          $scenarioFolderPathname.val() + ExtendSimModelName,
          true
        );
      }
    });
  };
  reader.readAsBinaryString(files[fileIndex]);
}

function ExtendSimASPsendFiles(scenarioFolderPathname, files) {
  // var queryDataURL = "http://127.0.0.1:3000/api/sendfiledata/";
  alert("Reading  " + files.length + " files");
  if (files.length) {
    sendFile(scenarioFolderPathname, files, 0);
  }
}

function ExtendSimASPsubmitSimulationScenario(
  userLoginSessionID,
  ExtendSimModelPath,
  removeFolderOnCompletion
) {
  // Execute WCF service to create a scenario folder
  // var queryURL = "http://184.171.246.58:8090/StreamingService/web/CreateScenarioFolder?scenarioFoldername=myScenarioFolder"
  // var queryURL = "http://127.0.0.1:3000/api/copymodeltoscenariofolder/" + encodeURIComponent(ExtendSimModelPath) + "&" + encodeURIComponent(scenarioFolderPathname) + "&" + true;
  var queryURL = "http://127.0.0.1:3000/api/submitsimulationscenario";

  alert(
    "Submitting the scenario now for userLoginSessionID=" + userLoginSessionID
  );
  $.ajax({
    url: queryURL,
    method: "get",
    // accept : 'application/json',
    contentType: "application/json;charset=utf-8",
    headers: myheaders,
    muteHttpExceptions: false,
    data: {
      userLoginSessionID: userLoginSessionID,
      modelPathname: ExtendSimModelPath,
      removeFolderOnCompletion: removeFolderOnCompletion
    }
  }).then(function(response) {
    console.log("ExtendSimASPsubmitSimulationScenario: " + response);
  });
}

// }
//  Respond to user clicking button to submit the simulation scenarion they have created
var handleSubmitLoginInfoBtnClick = function(event) {
  event.preventDefault();
  ExtendSimASPloginAJAX(
    $username.val(),
    $password.val(),
    ExtendSimASPcreateScenarioFolder
  );
};

var handleSubmitSimulationScenarioBtnClick = function(event) {
  event.preventDefault();
  ExtendSimASPcreateScenarioFolder($scenarioName.val());
};
//________________________________________
// Add event listeners
//  Buttons
$submitLoginInfoBtn.on("click", handleSubmitLoginInfoBtnClick);
$submitSimulationScenarioBtn.on(
  "click",
  handleSubmitSimulationScenarioBtnClick
);
// Drop area events
$(document).on("dragover", "#drop-area", function(event) {
  event.preventDefault();
  event.stopPropagation();
});
$(document).on("dragenter", "#drop-area", function(event) {
  event.preventDefault();
  event.stopPropagation();
});
$(document).on("drop", "#drop-area", function(event) {
  event.preventDefault();
  var dataTransfer = event.originalEvent.dataTransfer;
  //  Save the list of files for pushing to the server when the user submits the simulation scenario
  AJAXscenarioInputfiles = event.originalEvent.dataTransfer.files;

  alert("You just uploaded " + AJAXscenarioInputfiles.length + " files");
  for (var i = 0; i < AJAXscenarioInputfiles.length; i++) {
    console.log(
      "Filename=" +
        AJAXscenarioInputfiles[i].name +
        " size=" +
        AJAXscenarioInputfiles[i].size
    );
  }
  if (dataTransfer && AJAXscenarioInputfiles.length) {
    event.preventDefault();
    event.stopPropagation();
    // build formatted list of files with properties in an array
    for (var i = 0; i < AJAXscenarioInputfiles.length; i++) {
      scenarioInputFiles.push(
        "<li><strong>",
        decodeURI(AJAXscenarioInputfiles[i].name),
        "</strong> (",
        AJAXscenarioInputfiles[i].type || "n/a",
        ") - ",
        AJAXscenarioInputfiles[i].size,
        " bytes, last modified: ",
        AJAXscenarioInputfiles[i].lastModifiedDate
          ? AJAXscenarioInputfiles[i].lastModifiedDate.toLocaleDateString()
          : "n/a",
        "</li>"
      );
    }
    // display the list of files on the web page
    var $scenarioInputFiles = $("#scenario-input-files-list");
    $scenarioInputFiles.html("<ul>" + scenarioInputFiles.join("") + "</ul>");
  }
});
