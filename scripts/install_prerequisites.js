console.log("Running hook to install push notifications pre-requisites");

module.exports = function (context) {
  try {
    var child_process = require('child_process'),
        deferral = require('q').defer();

    var output = child_process.exec('npm install', {cwd: __dirname}, function (error) {
      if (error !== null) {
        console.log('exec error: ' + error);
        deferral.reject('npm installation failed');
      }
      else {
        deferral.resolve();
      }
    });

    return deferral.promise;
  } catch (error) {
    console.error('Error in install_prerequisites:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
};
