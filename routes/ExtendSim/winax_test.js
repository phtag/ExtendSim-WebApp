var axios = require("axios");
var fs = require("fs");
var winax = require("winax");

async function launchExcel() {  
    var excel = await new ActiveXObject("Excel.Application");
    excel.visible= await true;
    excel.Workbooks.Open("C:\Users\peter\Desktop\Bootcamp\ExtendSimASP_dev\winax_test.xlsx");
}
function launchExtendSim() {
    var ExtendSimApp =  new winax.Object("Extendsim.Application", "-platform offscreen");
    var connectionPoints = winax.getConnectionPoints(ExtendSimApp);
    console.log(connectionPoints);
    var ExtendSimCommand =  'OpenExtendFile("C:\Users\peter\Documents\ExtendSim10 Development\Examples\Discrete Event\Call Center.mox");';
    ExtendSimCommand =  "ExecuteMenuCommand(1);"
    // ExtendSimApp.execute(ExtendSimCommand);
};

launchExtendSim();
// launchExcel();
