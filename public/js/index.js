var proxyUrl = 'https://cors-anywhere.herokuapp.com/';
var scenarioFolderPathname;
var myheaders = { 
    accept: "application/json", 
    crossDomain: true,
    dataType: 'jsonp',
    Methods: "GET, POST, PUT"
};
var myScenarioFolderName = "myProject2_scenario";
var scenarioFilenames = ['Resource Classes.txt',
                         'Model Parameters.txt',
                         'Pools.txt',
                         'Process Route.txt',
                         'Resource Requirement Expressions.txt',
                         'Resources.txt'];
var output = [];
const c_ExtendSimModelPath = "C:/Users/Administrator/Documents/ExtendSim10ASP_Prod/ASP/ASP Servers/ExtendSim Models/ASP example model (GS).mox"

// Get references to page elements
var $exampleText = $("#example-text");
var $exampleDescription = $("#example-description");
var $submitLoginInfoBtn = $("#submit-login-info");
var $submitSimulationScenarioBtn = $("#submit-simulation-scenario");
var $exampleList = $("#example-list");
var $scenarioName = $("#scenario-name-text");
var $username = $("#username-text");
var $password = $("#password-text");

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
      var targetUrl =  queryURL;
      var options_textPOST = {method : "POST",
                    accept : "application/json",
                    contentType: "application/json;charset=utf-8",
                    headers : myheaders,
                    muteHttpExceptions : false};
      alert("Login...");
      $.ajax({
          url: targetUrl,
          method: 'get',
          accept : 'application/json',
          contentType: 'application/json;charset=utf-8',
          headers : myheaders
        }).then(function(response) {
            var scenario_ID = response;
            if (scenario_ID === "") {
                console.log("ERROR: ExtendSimASP_login_AJAX");
            } else {
              $("#scenario-id").val(scenario_ID);
              console.log('ExtendSimASP_login_AJAX: ' + scenario_ID);
              // login_callback(ExtendSimASP_copyModelToScenarioFolder);
            }
      });
  }
  
  function ExtendSimASP_createScenarioFolder(myScenarioFolderName, createScenarioFolder_callback) {
      // Execute WCF service to create a scenario folder  
      // var queryURL = "http://184.171.246.58:8090/StreamingService/web/CreateScenarioFolder?scenarioFoldername=myScenarioFolder"
      var queryURL = "http://127.0.0.1:3000/api/createscenariofolder/" + myScenarioFolderName;
      $.ajax({
          url: queryURL,
          method: 'get',
          accept : 'application/json',
          contentType: 'application/json;charset=utf-8',
          headers : myheaders,
          muteHttpExceptions : false
      }).then(function(response) {
          console.log('ExtendSimASP_createScenarioFolder: ' + response);
          scenarioFolderPathname = response;
          $("#scenario-folder-pathname").val(scenarioFolderPathname);
          ExtendSimASP_copyModelToScenarioFolder(scenarioFolderPathname);
      });
  }

  function ExtendSimASP_copyModelToScenarioFolder(scenarioFolderPathname) {
    // Execute WCF service to create a scenario folder  
    // var queryURL = "http://184.171.246.58:8090/StreamingService/web/CreateScenarioFolder?scenarioFoldername=myScenarioFolder"
    var queryURL = "http://127.0.0.1:3000/api/copymodeltoscenariofolder/" + encodeURIComponent(c_ExtendSimModelPath) + "&" + encodeURIComponent(scenarioFolderPathname) + "&" + true;
    // var queryURL = "http://127.0.0.1:3000/api/copymodeltoscenariofolder2";
    alert("ExtendSimASP_copyModelToScenarioFolder making request to server");
    $.ajax({
        url: queryURL,
        method: 'get',
        accept : 'application/json',
        contentType: 'application/json;charset=utf-8',
        headers : myheaders,
        muteHttpExceptions : false,
        // data : {
        //   modelPathname : "big trapper",
        //   scenarioFolderPathname : encodeURIComponent(scenarioFolderPathname),
        //   copyFolderContents : true
        // }
    }).then(function(response) {
        console.log('ExtendSimASP_copyModelToScenarioFolder: ' + response);
        // scenarioFolderPathname = response;
        // $("#scenario-folder-pathname").val(scenarioFolderPathname);
        // ExtendSimASP_copyModelToScenarioFolder(scenarioFolderPathname);
    });
}

//   function ExtendSimASP_copyModelToScenarioFolder(scenarioFolderPathname) {
//     console.log('ExtendSimASP_copyModelToScenarioFolder entry...');
//     var myheaders = { 
//       accept: "application/json", 
//     }; 
//     var queryURL = "http://127.0.0.1:3000/api/copymodeltoscenariofolder2/" + c_ExtendSimModelPath + "&" + scenarioFolderPathname + "&" + true;

//     // var queryURL = "http://127.0.0.1:3000/api/copymodeltoscenariofolder/" + c_ExtendSimModelPath + "&" + scenarioFolderPathname + "&true";
//       // var queryURL = "http://184.171.246.58:8090/StreamingService/web/CopyModelToScenarioFolder";
//       // var queryURL = "http://184.171.246.58:8090/StreamingService/web/CopyModelToScenarioFolder?modelPathname=" + 
//       // encodeURIComponent(c_ExtendSimModelPath) + 
//       //  "&scenarioFolderpath=" + encodeURIComponent(scenarioFolderPathname) + "&copyFolderContents=True";  
//   // console.log('ExtendSimASP_copyModelToScenarioFolder: url=' + queryURL);
//   alert("copymodeltoscenariofolder...");
//   $.ajax({
//       url: queryURL,
//       method: 'get',
//       accept : 'application/json',
//       contentType: 'application/json;charset=utf-8',
//       headers : myheaders,
//       muteHttpExceptions : false,
//       // params : {
//       //   modelPathname : c_ExtendSimModelPath,
//       //   scenarioFolderPathname : scenarioFolderPathname,
//       //   copyFolderContents : true
//       // }
//   }).then(function(response) {
//       console.log('ExtendSimASP_copyModelToScenarioFolder: ' + response.data);            
//       // copyModelToScenarioFolder_callback(scenarioFolderPathname, scenarioFilenames);
//   });
// };
//   function ExtendSimASP_sendFile(scenarioFolderPathname, filenames) {
//     filenames.forEach(function(filename) {
//         fs.readFile(filename, 'utf8', function(error, result) {
//             if (error) {
//                 console.log('Error' + error);
//             }
//             console.log('Result=' + result);
//             var myheaders = { 
//                 accept: "application/json", 
//             };  
//             var queryURL = "http://127.0.0.1:3000/api/sendfiledata/";
//             // var queryURL =  "http://184.171.246.58:8090/StreamingService/web/UploadPathname?filepathname=" + encodeURIComponent(scenarioFolderPathname + "/" + filename);
//             axios({
//                 url: queryURL,
//                 method: 'post',
//                 accept : "application/json",
//                 contentType: "application/json;charset=utf-8",
//                 headers : myheaders,
//                 muteHttpExceptions : false
//             }).then(function(response) {
//                 console.log('Uploaded pathname...');
//                 var queryURL =  "http://184.171.246.58:8090/StreamingService/web/UploadStream"
//                 axios({
//                 url: queryURL,
//                 method: 'post',
//                 accept : 'application/json',
//                 //    contentType: 'application/json;charset=utf-8',
//                 contentType: 'multipart/form-data',
//                 headers : myheaders,
//                 data: result,
//                 //    payload : result,
//                 muteHttpExceptions : false
//             }).then(function(response) {
//                 console.log('ExtendSimASP_sendFile: ' + response.data);
//           });   
//         }); 
//       })
//     });
// }
// }


// The API object contains methods for each kind of request we'll make
var API = {
  saveExample: function(example) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "api/examples",
      data: JSON.stringify(example)
    });
  },
  getExamples: function() {
    return $.ajax({
      url: "api/examples",
      type: "GET"
    });
  },
  deleteExample: function(id) {
    return $.ajax({
      url: "api/examples/" + id,
      type: "DELETE"
    });
  }
};

// refreshExamples gets new examples from the db and repopulates the list
var refreshExamples = function() {
  API.getExamples().then(function(data) {
    var $examples = data.map(function(example) {
      var $a = $("<a>")
        .text(example.text)
        .attr("href", "/example/" + example.id);

      var $li = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": example.id
        })
        .append($a);

      var $button = $("<button>")
        .addClass("btn btn-danger float-right delete")
        .text("ｘ");

      $li.append($button);

      return $li;
    });

    $exampleList.empty();
    $exampleList.append($examples);
  });
};

// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list
var handleSubmitLoginInfoBtnClick = function(event) {
  event.preventDefault();
  alert("Here we go!");
  ExtendSimASP_login_AJAX($username.val(), $password.val(), ExtendSimASP_createScenarioFolder);
};

var handleSubmitSimulationScenarioBtnClick = function(event) {
  event.preventDefault();
  ExtendSimASP_createScenarioFolder($scenarioName.val(), ExtendSimASP_copyModelToScenarioFolder);
};

// handleDeleteBtnClick is called when an example's delete button is clicked
// Remove the example from the db and refresh the list
var handleDeleteBtnClick = function() {
  var idToDelete = $(this)
    .parent()
    .attr("data-id");

  API.deleteExample(idToDelete).then(function() {
    refreshExamples();
  });
};

// Add event listeners to the submit and delete buttons
$submitLoginInfoBtn.on("click", handleSubmitLoginInfoBtnClick);
$submitSimulationScenarioBtn.on("click", handleSubmitSimulationScenarioBtnClick);
