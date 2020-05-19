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
    // Required variables are automatically validated by actions, if missing getInput will throw an error
    serviceAccountJsonRaw = core.getInput(serviceJsonPropertyName, { required: true });
    packageName = core.getInput(packageNamePropertyName, { required: true });
    apkPath = core.getInput(apkPathPropertyName, { required: false });
    aabPath = core.getInput(aabPathPropertyName, { required: false });

    // Any optional inputs should be validated here
    if (!apkPath && !aabPath) {
        throw new Error(`You must provide either '${apkPathPropertyName}' or '${aabPathPropertyName}' to use this action`)
    }
}

/**
 * This function uses the raw json passed by the user and sets it to the process environment variables.
 */
export function setGoogleCredentials() {
    if (serviceAccountJsonRaw) {
        // TODO: do we need to do this? We can put the json string directly in the environment variables
        const serviceAccountFile = "./serviceAccount.json";
        fs.writeFileSync(serviceAccountFile, serviceAccountJsonRaw, {
            encoding: 'utf8'
        });

        // Ensure that the api can find our service account credentials
        core.exportVariable("GOOGLE_APPLICATION_CREDENTIALS", serviceAccountFile);
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

    // TODO: does this block need to be tested?
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