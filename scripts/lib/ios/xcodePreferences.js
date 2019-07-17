/*
Script activates support for Universal Links in the application by setting proper preferences in the xcode project file.
Which is:
- deployment target set to iOS 9.0
- .entitlements file added to project PBXGroup and PBXFileReferences section
- path to .entitlements file added to Code Sign Entitlements preference
*/

var path = require('path');
var compare = require('node-version-compare');
var pathUtils = require('./entitlementFilePath.js');
var ConfigXmlHelper = require('../configXmlHelper.js');
var IOS_DEPLOYMENT_TARGET = '8.0';
var COMMENT_KEY = /_comment$/;
var context;

module.exports = {
    enableGroupsCapability: enableGroupsCapability
}

// region Public API

/**
 * Activate associated domains capability for the application.
 *
 * @param {Object} cordovaContext - cordova context object
 */
function enableGroupsCapability(cordovaContext) {
    context = cordovaContext;

    var projectFile = loadProjectFile();

    // adjust preferences
    enableGroups(projectFile.xcode);

    // save changes
    projectFile.write();
}

// endregion

// region Alter project file preferences

/**
 * Activate associated domains support in the xcode project file:
 * - set deployment target to ios 9;
 * - add .entitlements file to Code Sign Entitlements preference.
 *
 * @param {Object} xcodeProject - xcode project preferences; all changes are made in that instance
 */
function enableGroups(xcodeProject) {
    var configurations = nonComments(xcodeProject.pbxXCBuildConfigurationSection());
    var entitlementsFilePath = pathUtils.pathToEntitlementsFile(context);
    var config;
    var buildSettings;
    var deploymentTargetIsUpdated;

    for (config in configurations) {
        buildSettings = configurations[config].buildSettings;
        buildSettings['CODE_SIGN_ENTITLEMENTS'] = '"' + entitlementsFilePath + '"';
    }

    if (deploymentTargetIsUpdated) {
        console.log('IOS project now has deployment target set as: ' + IOS_DEPLOYMENT_TARGET);
    }

    console.log('IOS project Code Sign Entitlements now set to: ' + entitlementsFilePath);
}

// endregion
// region Xcode project file helpers

/**
 * Load iOS project file from platform specific folder.
 *
 * @return {Object} projectFile - project file information
 */
function loadProjectFile() {
    var platform_ios;
    var projectFile;

    try {
        // try pre-5.0 cordova structure
        platform_ios = context.requireCordovaModule('cordova-lib/src/plugman/platforms')['ios'];
        projectFile = platform_ios.parseProjectFile(iosPlatformPath());
    } catch (e) {
        try { // let's try cordova 5.0 structure
            platform_ios = context.requireCordovaModule('cordova-lib/src/plugman/platforms/ios');
            projectFile = platform_ios.parseProjectFile(iosPlatformPath());
        } catch (e) {
            // try cordova 7 structure
            // Then cordova 7.0
            var project_files = context.requireCordovaModule('glob').sync(path.join(iosPlatformPath(), '*.xcodeproj', 'project.pbxproj'));

            if (project_files.length === 0) {
                throw new Error('does not appear to be an xcode project (no xcode project file)');
            }

            var pbxPath = project_files[0];

            var xcodeproj = context.requireCordovaModule('xcode').project(pbxPath);
            xcodeproj.parseSync();

            projectFile = {
                'xcode': xcodeproj,
                write: function() {
                    var fs = context.requireCordovaModule('fs');

                    var frameworks_file = path.join(iosPlatformPath(), 'frameworks.json');
                    var frameworks = {};
                    try {
                        frameworks = context.requireCordovaModule(frameworks_file);
                    } catch (e) {}

                    fs.writeFileSync(pbxPath, xcodeproj.writeSync());
                    if (Object.keys(frameworks).length === 0) {
                        // If there is no framework references remain in the project, just remove this file
                        context.requireCordovaModule('shelljs').rm('-rf', frameworks_file);
                        return;
                    }
                    fs.writeFileSync(frameworks_file, JSON.stringify(this.frameworks, null, 4));
                }
            };

        }
    }

    return projectFile;
}

/**
 * Remove comments from the file.
 *
 * @param {Object} obj - file object
 * @return {Object} file object without comments
 */
function nonComments(obj) {
    var keys = Object.keys(obj);
    var newObj = {};

    for (var i = 0, len = keys.length; i < len; i++) {
        if (!COMMENT_KEY.test(keys[i])) {
            newObj[keys[i]] = obj[keys[i]];
        }
    }

    return newObj;
}

// endregion

// region Path helpers

function iosPlatformPath() {
    return path.join(projectRoot(), 'platforms', 'ios');
}

function projectRoot() {
    return context.opts.projectRoot;
}
// endregion
