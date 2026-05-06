console.log("Running hook to install push notifications pre-requisites");

module.exports = function (context) {
  var child_process = require('child_process');

  return new Promise(function(resolve, reject) {
    child_process.exec('npm install', {cwd: __dirname}, function (error) {
      if (error !== null) {
        console.log('exec error: ' + error);
        reject('npm installation failed');
      } else {
        resolve();
      }
    });
  });
};