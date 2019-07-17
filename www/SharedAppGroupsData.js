
var exec = require('cordova/exec');


/**
 * Fetch the stored information for the given type from the shared storage.
 * @param options - object that should contain 3 properties:
	key: "foo",
	suite: "group.cats.catsAreAwesome"};
 * @param success a success callback
 * @param error an error callback
 */
exports.load = function (options, success, error) {
	exec(success, error, 'SharedAppGroupsData', 'load', [options]);
};

/**
 * Save information for the given entity in the shared storage.
 * @param options - object that should contain 3 properties:
	key: "foo",
	value: "bar",
	suite: "group.cats.catsAreAwesome"};
 * @param success a success callback
 * @param error an error callback
 */
exports.save = function (options, success, error) {
	exec(success, error, 'SharedAppGroupsData', 'save', [options]);
};


