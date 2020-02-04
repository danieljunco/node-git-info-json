import fs from 'fs';
import cpp from 'child-process-promise';

var exec = cpp.exec;


var trim = function trim(result) {
  return result.stdout.trim();
};

var getBranch = function getBranch() {
  return exec('git rev-parse --abbrev-ref HEAD').then(trim);
};

var getCommitId = function getCommitId() {
  return exec("git rev-parse HEAD").then(trim);
};

var getTag = function getTag() {
  return exec("git describe --tags").then(trim);
};

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/**
 * @param destinationPath   Directory to save git.properties file to (directory must already exist).
 * @param callback  Function to call when git.properties file has been written or when an error doing so occurs.
 */

var write = function write(destinationPath) {
  return new Promise(function (resolve, reject) {
    destinationPath = destinationPath || process.cwd(); // default location for saving the git.properties file
    // will be the current working directory of the Node.js process.

    var gitPromises = [getBranch(), getCommitId(), getTag()];

    Promise.all(gitPromises).then(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 3),
          branch = _ref2[0],
          commitId = _ref2[1],
          tag = _ref2[2];

      var gitProperties = {
        git: {
          commit: {
            id: commitId
          },
          branch: branch,
          tag: tag
        }
      };

      var gitPropertiesFormatted = JSON.stringify(gitProperties, null, 2); //returnInfo.join(''); // format git properties for marshalling to file

      var destinationPathCleaned = destinationPath.replace(/\/?$/, "/"); // make sure destination path ends
      // with '/'

      // Generate git.properties.json file
      fs.writeFile(destinationPathCleaned + "git.properties.json", gitPropertiesFormatted, function (err) {
        if (err) {
          // error has occured saving git.properties
          console.log("[node-git-info][ERROR]: can't create git.properties.json file.");
          reject();
        } else {
          // saving git.properties was a success
          console.log("[node-git-info] git.properties.json has successfully created.");
          resolve();
        }
      });
    });
  });
};

var commandLineArgs = require("command-line-args");

// library's entry point
var execute = function execute() {
  // define allows command line arguments when calling library
  var optionDefinitions = [{ name: "directory", alias: "d", type: String }];

  // convert command line arguments to object
  var options = commandLineArgs(optionDefinitions);

  // write git.properties.json file
  write(options.directory).then(function () {
    return process.exit(0);
  }).catch(function () {
    return process.exit(1);
  });
};

execute();

export default execute;
