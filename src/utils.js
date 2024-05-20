const fs = require('fs');
const fse = require('fs-extra');
const process = require('process');
const chalk = require('chalk');
const constants = require('./constants');
const CONFIG_FILE = constants.files.configFile;
const config = require('./modules/config')
const axios = require('axios');
const package = require('../package.json')

let error = (message) => {
    console.error(`neu: ${chalk.bgRed.black('ERRR')} ${message}`);
}

let isNeutralinojsProject = () => {
    return fs.existsSync(CONFIG_FILE);
}

let getFiglet = () => {
    const neutralinoText = 
 `  _   _            _             _ _             _
 | \\ | | ___ _   _| |_ _ __ __ _| (_)_ __   ___ (_)___
 |  \\| |/ _ \\ | | | __| '__/ _' | | | '_ \\ / _ \\| / __|
 | |\\  |  __/ |_| | |_| | | (_| | | | | | | (_) | \\__ \\
 |_| \\_|\\___|\\__,_|\\__|_|  \\__,_|_|_|_| |_|\\___// |___/
                                               |__/`;

    return neutralinoText;
}

let showArt = () => {
    console.log(getFiglet());
}

let checkCurrentProject = () => {
    if (!isNeutralinojsProject()) {
        error(`Unable to find ${CONFIG_FILE}. ` +
            `Please check whether the current directory has a Neutralinojs project.`);
        process.exit(1);
    }
    const configObj =  config.get();
    if(Object.keys(configObj).length == 0) {
        error(`${CONFIG_FILE} is not a valid Neutralinojs configuration JSON file.`);
        process.exit(1);
    }
}

let checkLatestVersion = async () => {
    try {
        const response = await fetch(`https://registry.npmjs.org/${package.name}`);
        if (!response.ok) {
            error(`HTTP error! Status: ${response.status}`);
        }     
        const data = await response.json();
        const versionsArray = Object.keys(data.time);
        const latestVersion = versionsArray[versionsArray.length - 1];       
        if (package.version !== latestVersion) {
            warn(`Please update to the latest version: ${latestVersion}`);
        } else {
            return;
        }
    } catch (error) {
        console.error('Error:', error);
    }
}


let log = (message) => {
    console.log(`neu: ${chalk.bgGreen.black('INFO')} ${message}`);
}

let warn = (message) => {
    console.warn(`neu: ${chalk.bgYellow.black('WARN')} ${message}`);
}

let trimPath = (path) => {
    return path ? path.replace(/^\//, '') : path;
}

let clearDirectory = (path) => {
    fse.removeSync(path);
}

let getVersionTag = (version) => {
    return version != 'nightly' ? 'v' + version : version;
}

let filterFiles = (src, pattern) => {
    if(!Array.isArray(pattern)) pattern = [pattern];
    const regex = new RegExp(pattern.join('|'));
    const found = src.match(regex);
    return !found;
}

module.exports = {
    error,
    isNeutralinojsProject,
    getFiglet,
    showArt,
    checkCurrentProject,
    checkLatestVersion,
    log,
    warn,
    trimPath,
    getVersionTag,
    clearDirectory,
    filterFiles
}
