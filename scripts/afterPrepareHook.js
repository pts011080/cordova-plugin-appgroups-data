/**
 Hook is executed at the end of the 'prepare' stage. Usually, when you call 'cordova build'.
 It will inject required preferences in the platform-specific projects, based on <universal-links>
 data you have specified in the projects config.xml file.
 */

var configParser = require('./lib/configXmlParser.js');
var iosProjectEntitlements = require('./lib/ios/projectEntitlements.js');
var iosProjectPreferences = require('./lib/ios/xcodePreferences.js');
var IOS = 'ios';

module.exports = function(ctx) {
    run(ctx);
};

/**
 * Execute hook.
 *
 * @param {Object} cordovaContext - cordova context object
 */
function run(cordovaContext) {
    var groupName = configParser.getGroupName(cordovaContext);
    var platformsList = cordovaContext.opts.platforms;

    // if no host is defined - exit
    if (groupName === null) {
        console.warn('No groupName is specified in the app config.xml. Shared Storage Plugin is not going to work.');
        return;
    }

    platformsList.forEach(function(platform) {
        if (platform === IOS) {
            activateGroupCapabilities(cordovaContext);
        }
    });
}

/**
 * Activate Universal Links for iOS application.
 *
 * @param {Object} cordovaContext - cordova context object
 */
function activateGroupCapabilities(cordovaContext) {

    var groupName = configParser.getGroupName(cordovaContext);
    // modify xcode project preferences
    iosProjectPreferences.enableGroupsCapability(cordovaContext);

    // generate entitlements file
    iosProjectEntitlements.generateEntitlements(cordovaContext, groupName);
}
