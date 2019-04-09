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
var uploadedInputFiles = [];
var AJAXscenarioInputfiles = [];
var ExtendSimModelPath =
  "C:/Users/Administrator/Documents/ExtendSim10ASP_Prod/ASP/ASP Servers/ExtendSim Models/ASP example model (GS).mox";

// Get references to page elements
var $exampleText = $("#example-text");
var $exampleDescription = $("#example-description");
var $submitLoginInfoBtn = $("#submit-login-info");
var $submitSimulationScenarioBtn = $("#submit-simulation-scenario");
var $exampleList = $("#example-list");
var $scenarioName = $("#scenario-name-text");
var $username = $("#username-text");
var $password = $("#password-text");
var $dropArea = $("#drop-area");
//  ExtendSim API functions
function ExtendSimASP_login_AJAX(username, password, login_callback) {
  // $.get(proxyUrl + targetUrl, function(data) {
  //    console.log(data);
  // });
  // var queryURL = "http://184.171.246.58:8090/StreamingService/web/LoginToServer?username=admin&password=model";
  // var queryURL = "localhost:3000/api/login/admin&model";
  var queryURL = "http://127.0.0.1:3000/api/login/" + username + "&" + password;

  // var queryURL = "http://184.171.246.58:8090/StreamingService/web/LoginToServer";
  // var targetUrl = proxyUrl + queryURL;
  var targetUrl = queryURL;
  var options_textPOST = {
    method: "POST",
    accept: "application/json",
    contentType: "application/json;charset=utf-8",
    headers: myheaders,
    muteHttpExceptions: false
  };
  $.ajax({
    url: targetUrl,
    method: "get",
    accept: "application/json",
    contentType: "application/json;charset=utf-8",
    headers: myheaders
  }).then(function(response) {
    var scenario_ID = response;
    if (scenario_ID === "") {
      console.log("ERROR: ExtendSimASP_login_AJAX");
    } else {
      $("#scenario-id").val(scenario_ID);
      console.log("ExtendSimASP_login_AJAX: " + scenario_ID);
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
function sendFile(fileIndex) {

}
function ExtendSimASPsendFiles(scenarioFolderPathname, files) {
  var queryNameURL = "http://127.0.0.1:3000/api/sendfilename/";
  // var queryDataURL = "http://127.0.0.1:3000/api/sendfiledata/";
  alert("Reading  " + files.length + " files");

  for (var i = 0; i < files.length; i++) {
    var reader = new FileReader();
    reader.onload = (function(thisFile) {
      return function(e) {
        // Here you can use `e.target.result` or `this.result`
        // and `f.name`.
        var filename = thisFile.name;
        console.log("Reader result=" + e.result);
        alert("Sending file = " + filename);
        $.ajax({
          url: queryNameURL,
          method: "get",
          accept: "application/json",
          // contentType: "multipart/form-data",
          contentType: "application/json;charset=utf-8",
          headers: myheaders,
          data: reader.result,
          muteHttpExceptions: false,
          data: {
            scenarioFolderPathname: scenarioFolderPathname,
            filename: filename
          }
        }).then(function(response) {
          console.log("Response=" + response);
        });
      };
    })(file);
    var file = files[i];
    reader.readAsBinaryString(file);
  }
  // var myheaders = {
  //   accept: "application/json",
  // };
  // var queryURL =  "http://184.171.246.58:8090/StreamingService/web/UploadPathname?filepathname=" + encodeURIComponent(scenarioFolderPathname + "/" + filename);
}
// }
//  Respond to user clicking button to submit the simulation scenarion they have created
var handleSubmitLoginInfoBtnClick = function(event) {
  event.preventDefault();
  ExtendSimASP_login_AJAX(
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
