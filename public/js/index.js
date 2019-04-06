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
var $exampleList = $("#example-list");
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
  
  function ExtendSimASP_createScenarioFolder(createScenarioFolder_callback) {
      // Execute WCF service to create a scenario folder  
      // var queryURL = "http://184.171.246.58:8090/StreamingService/web/CreateScenarioFolder?scenarioFoldername=myScenarioFolder"
      var queryURL = "http://127.0.0.1:3000/api/createscenariofolder/" + myScenarioFolderName;
      var myheaders = { 
          accept: "application/json", 
      }; 
      
      var options1 = {method : "GET",
                  accept : "application/json",
                  contentType: "application/json;charset=utf-8",
                  headers : myheaders,
                  muteHttpExceptions : false};
      
      //  var response = UrlFetchApp.fetch(url_createScenarioFolder, options1).getContentText()
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
          // createScenarioFolder_callback(response.data, ExtendSimASP_sendFile);
      });
  }

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
var handleFormSubmit = function(event) {
  event.preventDefault();
  alert("Submitting login information for username="+ $username.val() + " password=" + $password.val());
  ExtendSimASP_login_AJAX($username.val(), $password.val(), ExtendSimASP_createScenarioFolder);
  // var example = {
  //   text: $exampleText.val().trim(),
  //   description: $exampleDescription.val().trim()
  // };

  // if (!(example.text && example.description)) {
  //   alert("You must enter an example text and description!");
  //   return;
  // }

  // API.saveExample(example).then(function() {
  //   refreshExamples();
  // });

  // $exampleText.val("");
  // $exampleDescription.val("");
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
$submitLoginInfoBtn.on("click", handleFormSubmit);
$exampleList.on("click", ".delete", handleDeleteBtnClick);
