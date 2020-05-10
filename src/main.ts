import * as core from '@actions/core'
import * as jwt from './jwt'

const AuthServerUrlPropertyName = "auth_server";
const AuthEmailPropertyName = "auth_email";
const AuthKeyPropertyName = "auth_key";
const APKPathPropertyName = "path";

let authServerUrl: string | undefined;
let authEmail: string | undefined;
let authKey: string | undefined;
let apkPath: String | undefined;

function validateInput() {
    let errorMessage: string = "";
    if (!authServerUrl) {
        errorMessage = `Missing ${AuthServerUrlPropertyName} in action inputs`;
    } else if (!authEmail) {
        errorMessage = `Missing ${AuthEmailPropertyName} in action inputs`;
    } else if (!authKey) {
        errorMessage = `Missing ${AuthKeyPropertyName} in action inputs`;
    } else if (!apkPath) {
        errorMessage = `Missing ${APKPathPropertyName} in action inputs`;
    }

    if (errorMessage) {
        throw new Error(errorMessage);
    }
}

function main(): string {
    // Process and validate all input fields
    authServerUrl = core.getInput(AuthServerUrlPropertyName);
    authEmail = core.getInput(AuthEmailPropertyName);
    authKey = core.getInput(AuthKeyPropertyName);
    apkPath = core.getInput(APKPathPropertyName);
    validateInput();

    //TODO : Call for jwt token
    //TODO : Call for access token
    //TODO : Call for upload
    return ""
}

try {
    const url = main();
    core.setOutput("url", url)
} catch (err) {
    core.setFailed(err.message);
}