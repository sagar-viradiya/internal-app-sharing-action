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
 * This function 
 */
function validateInputs() {
    if (!serviceAccountJsonRaw) {
        throw new Error(`You must provide '${serviceJsonPropertyName}' to use this action`);
    }

    if (!packageName) {
        throw new Error(`You must provide '${packageNamePropertyName}' to use this action`);
    }

    if (!apkPath && !aabPath) {
        throw new Error(`You must provide either '${apkPathPropertyName}' or '${aabPathPropertyName}' to use this action`)
    }
}

async function main(): Promise<any> {
    serviceAccountJsonRaw = core.getInput(serviceJsonPropertyName, { required: true });
    packageName = core.getInput(packageNamePropertyName, { required: true });
    apkPath = core.getInput(apkPathPropertyName, { required: false });
    aabPath = core.getInput(aabPathPropertyName, { required: false });

    validateInputs();

    if (serviceAccountJsonRaw) {
        const serviceAccountFile = "./serviceAccountJson.json";
        fs.writeFileSync(serviceAccountFile, serviceAccountJsonRaw, {
            encoding: 'utf8'
        });

        // Insure that the api can find our service account credentials
        core.exportVariable("GOOGLE_APPLICATION_CREDENTIALS", serviceAccountFile);
    }

    // Acquire an auth client, and bind it to all future calls
    const authClient = await auth.getClient();
    google.options({
        auth: authClient,
    });

    let res;
    if(apkPath) {
        res = await androidpublisher.internalappsharingartifacts.uploadapk({
            packageName: packageName,
            media: {
                mimeType: 'application/octet-stream',
                body: fs.createReadStream(apkPath)
            }
        })
    } else {
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

main().then((url) => {
    core.setOutput("url", url)
}).catch ((e) => {
    core.setFailed(e.message)
})