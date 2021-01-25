#!/usr/bin/env node

const AWS = require('aws-sdk');
const path = require('path');
const fs = require('fs');
const ConfigParser = require('configparser');
const { config } = require('process');
const homedir = require('os').homedir();
var pjson = require('./package.json');

const AWS_CONFIG_PATH = path.resolve(homedir, '.aws/config');
const AWS_CREDENTIAL_PATH = path.resolve(homedir, '.aws/credentials');
const AWS_SSO_CACHE_PATH = path.resolve(homedir, '.aws/sso/cache');
const AWS_DEFAULT_REGION = "eu-west-1"

const setProfileCredentials = async (profileName) => {
    profile = getAwsProfile(profileName);
    cacheLogin = getSsoCachedLogin(profile);
    credentials = await getSsoRoleCredentials(profile, cacheLogin);
    updateAwsCredentials(profileName, profile, credentials);
}

const getSsoCachedLogin = (profile) => {
    filePaths = listDirectory(AWS_SSO_CACHE_PATH);
    timeNow = new Date();

    for (filePathIndex in filePaths) {
        let filePath = filePaths[filePathIndex];
        data = JSON.parse(fs.readFileSync(filePath));
        if (!data)
            continue
        if (data.startUrl != profile.sso_start_url)
            continue
        if (data.region != profile.sso_region)
            continue
        if (timeNow > new Date(data.expiresAt.substring(0,19)))
            continue
        return data
    }
}

const getSsoRoleCredentials = async (profile, login) => {
    client = new AWS.SSO({region: profile.sso_region});
    response = await client.getRoleCredentials({
        roleName: profile.sso_role_name,
        accountId: profile.sso_account_id,
        accessToken: login.accessToken
    }).promise();
    return response.roleCredentials
}

// TODO: review
const getAwsProfile = (profileName) => {
    let configContent = readConfig(AWS_CONFIG_PATH)
    profile = configContent.items(`profile ${profileName}`)
    if(!profile) {
        throw `Cannot find profile ${profileName} definition in ${AWS_CONFIG_PATH}`
    }
    return profile
}

const updateAwsCredentials = (profileName, profile, credentials) => {
    region = profile.region ? profile.region : AWS_DEFAULT_REGION
    if(!fs.existsSync(AWS_CREDENTIAL_PATH)) {
        fs.closeSync(fs.openSync(AWS_CREDENTIAL_PATH, 'w'));
    }
    let configContent = readConfig(AWS_CREDENTIAL_PATH)
    if (configContent.hasSection(profileName))
        configContent.removeSection(profileName)
    configContent.addSection(profileName)
    configContent.set(profileName, "region", region)
    configContent.set(profileName, "aws_access_key_id", credentials["accessKeyId"])
    configContent.set(profileName, "aws_secret_access_key", credentials["secretAccessKey"])
    configContent.set(profileName, "aws_session_token", credentials["sessionToken"])
    configContent.write(AWS_CREDENTIAL_PATH)
}

const listDirectory = (path) => {
    filePaths = []
    if (fs.existsSync(path)) {
        filePaths = fs.readdirSync(path)
        filePaths = filePaths.map(function (fileName) {
            return {
                name: fileName,
                time: fs.statSync(path + '/' + fileName).mtime.getTime()
            };
        })
        .sort(function (a, b) {
            return b.time - a.time; 
        })
        .map(function (v) {
            return path + '/' + v.name;
        });
    }
    return filePaths
}

const readConfig = (path) => {
    let configContent = new ConfigParser();
    configContent.read(path)
    return configContent
}

const main = async () => {
    console.log(`Running cdk-sso-sync version ${pjson.version}`);
    if (pjson.version === '0.0.4') {
        console.error(`Your version of the tool is outdated. Run "npm install -g cdk-sso-sync" to upgrade.`);
        process.exit([1]);
    }

    if(process.argv.slice(2).length != 1) {
        throw new Error(`Invalid number of argument, provide your profile name as a parameter (i.e. "cdk-sso-sync my-profile-name")`)
    }
    
    try {
        await setProfileCredentials(process.argv.slice(2)[0]);
        console.info(`You are all set! Now you can run cdk commands with "--profile ${process.argv.slice(2)[0]}" options !`);
    } catch (error) {
        console.error(`SSO credential sync failed. \n\n Make sure you logged in with aws sso by running: 'aws sso login --profile ${process.argv.slice(2)[0]}' \n\n Error: ${error}`);
        process.exit([1])
    }
}

main()
