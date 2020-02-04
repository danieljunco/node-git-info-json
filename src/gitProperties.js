import fs from "fs";
import {
  getBranch,
  getCommitId,
  getTag
} from "./gitCommands";

/**
 * @param destinationPath   Directory to save git.properties file to (directory must already exist).
 * @param callback  Function to call when git.properties file has been written or when an error doing so occurs.
 */

export const write = destinationPath => {
  return new Promise((resolve, reject) => {
    destinationPath = destinationPath || process.cwd(); // default location for saving the git.properties file
    // will be the current working directory of the Node.js process.

    const gitPromises = [
      getBranch(),
      getCommitId(),
      getTag()
    ];

    Promise.all(gitPromises).then(
      ([
        branch,
        commitId,
        tag
      ]) => {
        const gitProperties = {
          git: {
            commit: {
              id: commitId
            },
            branch: branch,
            tag: tag
          }
        };

        const gitPropertiesFormatted = JSON.stringify(gitProperties, null, 2); //returnInfo.join(''); // format git properties for marshalling to file

        const destinationPathCleaned = destinationPath.replace(/\/?$/, "/"); // make sure destination path ends
        // with '/'

        // Generate git.properties.json file
        fs.writeFile(
          destinationPathCleaned + "git.properties.json",
          gitPropertiesFormatted,
          err => {
            if (err) {
              // error has occured saving git.properties
              console.log(
                "[node-git-info][ERROR]: can't create git.properties.json file."
              );
              reject();
            } else {
              // saving git.properties was a success
              console.log(
                "[node-git-info] git.properties.json has successfully created."
              );
              resolve();
            }
          }
        );
      }
    );
  });
};
