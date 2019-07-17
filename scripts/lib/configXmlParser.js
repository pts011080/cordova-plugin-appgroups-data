/*
Parser for config.xml file. Read plugin-specific preferences (from <universal-links> tag) as JSON object.
*/
var path = require('path');
var ConfigXmlHelper = require('./configXmlHelper.js');
var DEFAULT_SCHEME = 'http';

module.exports = {
    getGroupName: getGroupName
};

// region Public API

/**
 * Get Deeplink host from the config.xml file.
 *
 * @param {Object} cordovaContext - cordova context object
 * @return {String} The host url
 */
function getGroupName(cordovaContext) {
    // read data from projects root config.xml file
    var configXml = new ConfigXmlHelper(cordovaContext).read();
    if (configXml == null) {
        console.warn('config.xml not found! Please, check that it exist\'s in your project\'s root directory.');
        return null;
    }

    var pluginElem = getGroupSharePlugin(configXml);

    if (pluginElem == null || pluginElem.length == 0) {
        console.warn('cordova-internal-plugins-group-storage is not set in the config.xml. The plugin is not going to work.');
        return null;
    }

    deeplinkHost = getGroupNameFromConfig(pluginElem);

    return deeplinkHost;
}

/**
 * Get group share plugin xml element
 * @param {Object} configXml The xml config
 * @returns {Object} The deeplinks plugin xml element
 */
function getGroupSharePlugin(configXml) {
    //console.log('getGroupSharePlugin - configXml', configXml)
    var xmlPlugins = configXml.widget.plugin;
    // console.log('getGroupSharePlugin - xmlPlugins', xmlPlugins)
    var pluginEleme = null;
    xmlPlugins.forEach(function(xmlElement) {

        // look for data from the ionic-plugin-deeplinks element
        if (xmlElement.$.name === 'cordova-internal-plugins-group-storage') {
            pluginEleme = xmlElement;
        }
    });
    return pluginEleme;
}

/**
 * Get deeplinks plugin host from the deeplinks config
 * @param {Object} xmlDeeplinksPlugin - The deeplinks plugin xml element
 * @returns {String} The deeplinks host
 */
function getGroupNameFromConfig(pluginConfig) {
    var pluginConfigVariables = pluginConfig['variable'];
    var groupName = null;
    if (pluginConfigVariables) {

        pluginConfigVariables.forEach(function(xmlElement) {
            if (xmlElement.$.name === 'APP_GROUP_NAME') {
                groupName = xmlElement.$.value;
            }
        });
    }
    return groupName;
}

// endregion