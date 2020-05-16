import * as core from '@actions/core'
import * as fs from "fs";
import { google } from "googleapis";

const androidpublisher = google.androidpublisher('v3');
const auth = new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/androidpublisher']
});

// Input property names
const serviceJsonPropertyName = "serviceAccountJsonPlainText";
const packageNamePropertyName = "packageName";
const apkPathPropertyName = "apkFilePath";
const aabPathPropertyName = "aabFilePath";

// Input values
let serviceAccountJsonRaw: string | undefined;
let packageName: string | undefined;
let apkPath: string | undefined;
let aabPath: string | undefined;

/**
 * This function is to make sure that the action receives valid inputs. For example it ensures that either apkPath or aabPath is provided.
 * @throws {Error} with an appropriate message depending on what input is missing
 */
export function getAndValidateInputs() {
    serviceAccountJsonRaw = core.getInput(serviceJsonPropertyName, { required: true });
    packageName = core.getInput(packageNamePropertyName, { required: true });
    apkPath = core.getInput(apkPathPropertyName, { required: false });
    aabPath = core.getInput(aabPathPropertyName, { required: false });

    if (!apkPath && !aabPath) {
        throw new Error(`You must provide either '${apkPathPropertyName}' or '${aabPathPropertyName}' to use this action`)
    }
}

export function setGoogleCredentials() {
    if (serviceAccountJsonRaw) {
        const serviceAccountFile = "./serviceAccountJson.json";
        fs.writeFileSync(serviceAccountFile, serviceAccountJsonRaw, {
            encoding: 'utf8'
        });

        // Ensure that the api can find our service account credentials
        core.exportVariable("GOOGLE_APPLICATION_CREDENTIALS", fs.readFileSync(serviceAccountFile, 'utf-8'));
    }
}

async function main(): Promise<any> {
    getAndValidateInputs();
    setGoogleCredentials();

    // Acquire an auth client, and bind it to all future calls
    const authClient = await auth.getClient();
    google.options({
        auth: authClient,
    });

    let res: any; // TODO: add a type to this
    if(apkPath) {
        res = await androidpublisher.internalappsharingartifacts.uploadapk({
            packageName: packageName,
            media: {
                mimeType: 'application/octet-stream',
                body: fs.createReadStream(apkPath)
            }
        })
    } else if (aabPath) {
        res = await androidpublisher.internalappsharingartifacts.uploadbundle({
            packageName: packageName,
            media: {
                mimeType: 'application/octet-stream',
                body: fs.createReadStream(aabPath)
            }
        })
    }
    return res.data;
}

main().then((data) => {
    core.setOutput("url", data)
}).catch ((e) => {
    core.setFailed(e.message)
})