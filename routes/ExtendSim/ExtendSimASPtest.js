
// var axios = require("axios");
// var fs = require("fs");

var scenarioFolderPathname;
var myheaders = { 
    accept: "application/json", 
};  
var scenarioFilenames = ['Resource Classes.txt',
                         'Model Parameters.txt',
                         'Pools.txt',
                         'Process Route.txt',
                         'Resource Requirement Expressions.txt',
                         'Resources.txt'];
var output = [];

const c_ExtendSimModelPath = "C:/Users/Administrator/Documents/ExtendSim10ASP_Prod/ASP/ASP Servers/ExtendSim Models/ASP example model (GS).mox"

function ExtendSimASP_login(login_callback) {
    var queryURL = "http://184.171.246.58:8090/StreamingService/web/LoginToServer?username=admin&password=model";
    // var queryURL = "http://184.171.246.58:8090/StreamingService/web/LoginToServer";

    myMethod = "POST"   
    var myheaders = { 
              accept: "application/json", 
      }; 
    
    var options_textPOST = {method : "POST",
                  accept : "application/json",
                  contentType: "application/json;charset=utf-8",
                  headers : myheaders,
                  muteHttpExceptions : false};
      console.log('Give this a whirl');
    axios({
        url: queryURL,
        method: 'post',
        accept : 'application/json',
        contentType: 'application/json;charset=utf-8',
        headers : myheaders,
        data: {
            username: 'admin',
            password: 'model'
        }
      }).then(function(response) {
          console.log('ExtendSimASP_login: ' + response.data);
          login_callback(ExtendSimASP_copyModelToScenarioFolder);
    });
}
function ExtendSimASP_login_AJAX(login_callback) {
    var queryURL = "https://184.171.246.58:8090/StreamingService/web/LoginToServer?username=admin&password=model";
    // var queryURL = "http://184.171.246.58:8090/StreamingService/web/LoginToServer";

    var options_textPOST = {method : "POST",
                  accept : "application/json",
                  contentType: "application/json;charset=utf-8",
                  headers : myheaders,
                  muteHttpExceptions : false};
      console.log('Give this a whirl');
    $.ajax({
        url: queryURL,
        method: 'post',
        accept : 'application/json',
        contentType: 'application/json;charset=utf-8',
        headers : myheaders,
        data: {
            username: 'admin',
            password: 'model'
        }
      }).then(function(response) {
          console.log('ExtendSimASP_login_AJAX: ' + response.data);
        //   login_callback(ExtendSimASP_copyModelToScenarioFolder);
    });
}

function ExtendSimASP_createScenarioFolder(createScenarioFolder_callback) {
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
        createScenarioFolder_callback(response.data, ExtendSimASP_sendFile);
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
function buttonClick()
{
    alert("Submitting scenario");
    ExtendSimASP_login_AJAX(ExtendSimASP_createScenarioFolder);
}

function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    alert('Files selected=' + files.length);
    // var reader = new FileReader();
    // files is a FileList of File objects. List some properties.
    for (var i = 0, f; f = files[i]; i++) {
      output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                  f.size, ' bytes, last modified: ',
                  f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                  '</li>');
    }
    // document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
    //   // Read in the image file as a data URL.
    // reader.readAsText(document.querySelector('input').files[0]);
    // console.log(reader);
    // alert('Done reading');

    fileInput = document.querySelector('input[type="file"]');
    console.log(fileInput.files.length);
    for (i=0;i<fileInput.files.length;i++) {
        read(fileInput.files.item(i), readTextFile);
    }
  }
function readTextFile(filename, result) {
    console.log('readTextFile: entry - file=' + filename);
    var queryURL =  "http://184.171.246.58:8090/StreamingService/web/UploadPathname?filepathname=" + encodeURIComponent(scenarioFolderPathname + "/" + filename);
    $.ajax({
        url: queryURL,
        method: 'post',
        accept : "application/json",
        contentType: "application/json;charset=utf-8",
        headers : myheaders,
        muteHttpExceptions : false
    }).then(function(response) {
        console.log('Uploaded pathname...');
        var queryURL =  "http://184.171.246.58:8090/StreamingService/web/UploadStream"
        $.ajax({
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

    console.log(result);
}
function read(file, callback) {
    // var fileInput = document.querySelector('input[type="file"]');
    // var file = fileInput.files.item(0);
        var reader = new FileReader();
        reader.onload = function() {
            callback(file, reader.result);
        }
        alert('File=' + file.name);
        reader.readAsText(file);
}
// alert('Open page');
var files = document.getElementById('files');
var fileInput = document.querySelector('input[type="file"]');
files.addEventListener('change', handleFileSelect, false);
//   document.addEventListener('click', select_element, true);
// ExtendSimASP_login(ExtendSimASP_createScenarioFolder);

