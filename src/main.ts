import * as core from '@actions/core'
import * as jwt from './jwt'
import { uploadFile } from "./upload";

const AuthServerUrlPropertyName = "auth_server";
const AuthEmailPropertyName = "auth_email";
const AuthKeyPropertyName = "auth_key";
const APKPathPropertyName = "path";
const PackageNamePropertyName = "package_name";

let authServerUrl: string | undefined;
let authEmail: string | undefined;
let authKey: string | undefined;
let apkPath: string | undefined;
let packageName: string | undefined;

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
    } else if (!packageName) {
        errorMessage = `Missing ${PackageNamePropertyName} in action inputs`;
    }

    if (errorMessage) {
        throw new Error(errorMessage);
    }
}

async function main(): Promise<string> {
    // Process and validate all input fields
    authServerUrl = core.getInput(AuthServerUrlPropertyName);
    authEmail = core.getInput(AuthEmailPropertyName);
    authKey = core.getInput(AuthKeyPropertyName);
    apkPath = core.getInput(APKPathPropertyName);
    packageName = core.getInput(PackageNamePropertyName);
    validateInput();

    //TODO : Call for jwt token
    let accessToken: string = ""; //TODO : Call for access token
    let url: string = await uploadFile(accessToken, apkPath, packageName);
    return url;
}

main()
    .then((url: string) => {
        core.setOutput("url", url);
    })
    .catch((e) => {
        core.setFailed(e.message);
    });