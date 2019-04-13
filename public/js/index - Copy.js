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
var dropActive = false;
//  localhost (use this for testing)
// var ExtendSimModelPath =
//   "C:/Users/peter/Documents/ExtendSim10ASP_Prod/ASP/ASP Servers/ExtendSim Models/ASP v10 models" +
//   ExtendSimModelName;

// ExtendSim server (use this for Heroku)
// alert("Loading page...");
var ExtendSimModelPath =
  "C:/Users/Administrator/Documents/ExtendSim10ASP_Prod/ASP/ASP Servers/ExtendSim Models" +
  ExtendSimModelName;
// Get references to page elements
var $submitLoginInfoBtn = $("#submit-login-info");
var $submitSimulationScenarioBtn = $("#submit-simulation-scenario");
var $showScenarioResultsBtn = $("#show-scenario-results");
var $scenarioName = $("#scenario-name-text");
var $userloginSessionID = $("#user-login-id");
var $scenarioID = $("#scenario-id");
var $scenarioFolderPathname = $("#scenario-folder-pathname");
var $scenarioRunStatus = $("#scenario-run-status");
var $username = $("#username-text");
var $password = $("#password-text");
var cycleTimeResultsFilename = "/Cycle Time Results.txt";
// var modelResultsFilename = "/Model Results.txt";
// var urlPrefix = "http://127.0.0.1:3000";
var urlPrefix = "";

var checkModelStatusTimer;
var runCompletedScenarioStatus = 3;

// $submitSimulationScenarioBtn.hide();
// $showScenarioResultsBtn.hide();
alert("Executing code...");
// var $dropArea = $("#drop-area");
//  ExtendSim API functions
function ExtendSimASPloginAJAX(username, password) {
  // $.get(proxyUrl + targetUrl, function(data) {
  //    console.log(data);
  // });
  // var queryURL = "http://184.171.246.58:8090/StreamingService/web/LoginToServer?username=admin&password=model";
  // var queryURL = "localhost:3000/api/login/admin&model";
  var queryURL = urlPrefix + "/api/login/" + username + "&" + password;

  // var queryURL = "http://184.171.246.58:8090/StreamingService/web/LoginToServer";
  // var targetUrl = proxyUrl + queryURL;
  var targetUrl = queryURL;
  return $.ajax({
    url: targetUrl,
    method: "get",
    accept: "application/json",
    contentType: "application/json;charset=utf-8",
    headers: myheaders
  }).then(function(response) {
    var userLoginID = response;
    if (userLoginID === "") {
      console.log("ERROR: ExtendSimASPloginAJAX");
    } else {
      // $userloginSessionID.val(userLoginID);
      console.log("ExtendSimASPloginAJAX: " + userLoginID);
      return userLoginID;
      // ask server to render the scenario inputs page
      // var queryURLscenarioInputs = urlPrefix + "/scenarioinputs";

      // $.ajax({
      //   url: queryURLscenarioInputs,
      //   method: "get",
      //   accept: "application/json",
      //   contentType: "application/json;charset=utf-8",
      //   headers: myheaders
      // }).then(function(response) {
      //   console.log(response);
      // });
    }
  });
}

function ExtendSimASPcreateScenarioFolder(myScenarioFolderName) {
  // Execute WCF service to create a scenario folder
  // var queryURL = "http://184.171.246.58:8090/StreamingService/web/CreateScenarioFolder?scenarioFoldername=myScenarioFolder"
  var queryURL =
    urlPrefix + "/api/createscenariofolder/" + myScenarioFolderName;
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
  // var queryURL = urlPrefix + "/api/copymodeltoscenariofolder/" + encodeURIComponent(ExtendSimModelPath) + "&" + encodeURIComponent(scenarioFolderPathname) + "&" + true;
  var queryURL = urlPrefix + "/api/copymodeltoscenariofolder";
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
  var queryNameURL = urlPrefix + "/api/sendfilename/";
  var reader = new FileReader();
  reader.onload = function(event) {
    var filename = files[fileIndex].name;
    event.preventDefault();
    // Here you can use `e.target.result` or `this.result`
    // and `f.name`.
    console.log("Reader result=" + reader.result);
    // alert("Sending file = " + filename);
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
          $userloginSessionID.val(),
          $scenarioFolderPathname.val() + ExtendSimModelName,
          true
        );
      }
    });
  };
  reader.readAsBinaryString(files[fileIndex]);
}

function ExtendSimASPsendFiles(scenarioFolderPathname, files) {
  // var queryDataURL = urlPrefix + "/api/sendfiledata/";
  // alert("Reading  " + files.length + " files");
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
  // var queryURL = urlPrefix + "/api/copymodeltoscenariofolder/" + encodeURIComponent(ExtendSimModelPath) + "&" + encodeURIComponent(scenarioFolderPathname) + "&" + true;
  var queryURL = urlPrefix + "/api/submitsimulationscenario";
  // alert(
  //   "Submitting the scenario now for userLoginSessionID=" + userLoginSessionID
  // );
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
    var scenarioID = response;
    $scenarioID.val(scenarioID);
    checkModelStatusTimer = setInterval(ExtendSimASPCheckModelRunStatus, 1000);
    // ExtendSimASPCheckModelRunStatus().then(function(result) {
    //   console.log("Status=" + result);
    // });
  });
}

function ExtendSimASPCheckModelRunStatus() {
  var queryURL = urlPrefix + "/api/checkmodelrunstatus";
  $.ajax({
    url: queryURL,
    method: "get",
    // accept : 'application/json',
    contentType: "application/json;charset=utf-8",
    headers: myheaders,
    muteHttpExceptions: false,
    data: {
      scenarioID: $scenarioID.val()
    }
  }).then(function(response) {
    console.log("ExtendSimCheckModelRunStatus: status=" + response);
    if (response === runCompletedScenarioStatus) {
      $scenarioRunStatus.val("Completed");
      clearInterval(checkModelStatusTimer);
      // pull results for the scenario
      ExtendSimASPgetScenarioResults(
        cycleTimeResultsFilename,
        $userloginSessionID.val()
      );
      $showScenarioResultsBtn.show();
      // ExtendSimASPCheckModelRunStatus(scenarioID);
    } else {
      $scenarioRunStatus.val("Running...");
    }
    return response;
  });
}

function ExtendSimASPgetScenarioResults(filename, userLoginSessionID) {
  var queryURL = urlPrefix + "/api/getscenarioresults";
  var myheaders = {
    accept: "application/json"
  };
  // alert("Getting scenario results");
  $.ajax({
    url: queryURL,
    method: "get",
    // accept : 'application/json',
    contentType: "application/json;charset=utf-8",
    headers: myheaders,
    muteHttpExceptions: false,
    data: {
      userLoginSessionID: userLoginSessionID,
      filepath: $scenarioFolderPathname.val() + filename
    }
  }).then(function(response) {
    console.log("ExtendSimASPgetScenarioResults: results=" + response);
    return response;
  });
}

// function validateScenarioInputs() {
//   if (($scenarioName.val() != "") || (AJAXscenarioInputfiles.length > 0)) {
//     $submitSimulationScenarioBtn.show();
//   }
// }
// }
//  Respond to user clicking button to submit the simulation scenarion they have created
var handleSubmitLoginInfoBtnClick = function(event) {
  event.preventDefault();
  // $.get("/scenarioinputs", function(data) {
  //   console.log(data);
  // });
  // $.get("/scenarioinputs", function(response) {
  //   console.log(response);
  //   $("html").html(response);
  // });
  ExtendSimASPloginAJAX($username.val(), $password.val()).then(function(
    userLoginID
  ) {
    // var queryURLscenarioInputs = urlPrefix + "/scenarioinputs";
    event.preventDefault();
    // alert("Returned userLoginID=" + userLoginID);
    console.log("userLoginID=" + userLoginID);
    // $.get("/scenarioinputs", function(pageHtml) {
    //   event.preventDefault();
    //   console.log(pageHtml);
    //   $("body").html(pageHtml);
    //   // $("body").html(pageHtml).promise.done(function(){
    //   //   alert("Promise done");
    //   // });
    // });
    var queryURLscenarioInputs = urlPrefix + "/scenarioinputs";
    $.ajax({
      url: queryURLscenarioInputs,
      method: "get",
      accept: "application/json",
      contentType: "application/json;charset=utf-8",
      headers: myheaders,
      data: {
        userLoginID: userLoginID
      }
    }).then(function(response) {
      event.preventDefault();
      // alert("Got page back");
      $("body").html(response);
    });
    // $userLoginID.val(userLoginID);
  });
};
// $(document).on("onkeypress", "#scenario-name-text", function(event) {
//   event.preventDefault();
//   validateScenarioInputs();
// });
var handleSubmitSimulationScenarioBtnClick = function(event) {
  event.preventDefault();
  // alert("Submitting..." + $scenarioName.val());
  ExtendSimASPcreateScenarioFolder($scenarioName.val());
};
// var handleCheckScenarioBtnClick = function(event) {
//   event.preventDefault();

//   // ExtendSimASPCheckModelRunStatus($scenarioID.val());
// };
//________________________________________
// Add event listeners
//  Buttons
$submitLoginInfoBtn.on("click", handleSubmitLoginInfoBtnClick);
$submitSimulationScenarioBtn.on(
  "click",
  handleSubmitSimulationScenarioBtnClick
);
// $checkScenarioStatusBtn.on("click", handleCheckScenarioBtnClick);
// Drop area events
$(document).on("dragover", "#drop-area", function(event) {
  alert("Here");
  event.preventDefault();
  event.stopPropagation();
});
$(document).on("dragenter", "#drop-area", function(event) {
  alert("Here");
  event.preventDefault();
  event.stopPropagation();
});
$(document).on("drop", "#drop-area", function(event) {
  event.preventDefault();
  alert("Drop");
  if (!dropActive) {
    var dataTransfer = event.originalEvent.dataTransfer;
    //  Save the list of files for pushing to the server when the user submits the simulation scenario
    AJAXscenarioInputfiles = event.originalEvent.dataTransfer.files;
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
      dropActive = true;
      // validateScenarioInputs();
    }
  } else {
    dropActive = false;
  }
});
