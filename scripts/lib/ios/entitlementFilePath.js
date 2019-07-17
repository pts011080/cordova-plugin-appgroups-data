var path = require('path');
var ConfigXmlHelper = require('../configXmlHelper.js');

//get relative path
function pathToEntitlementsFile(context) {
    var configXmlHelper = new ConfigXmlHelper(context),
        projectName = configXmlHelper.getProjectName(),
        fileName = 'Entitlements-Release.plist';

    return path.join(projectName, fileName);
}
module.exports = {
    pathToEntitlementsFile: pathToEntitlementsFile
}