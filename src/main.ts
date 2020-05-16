import * as core from '@actions/core'
import * as fs from "fs";
const {google} = require('googleapis');
const androidpublisher = google.androidpublisher('v3');

const auth = new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/androidpublisher']
});

async function main(): Promise<string> {
    const serviceAccountJsonRaw = core.getInput('serviceAccountJson', { required: true });
    const packageName = core.getInput('packageName', { required: true });
    const releaseFile = core.getInput('releaseFile', { required: true });

    if (serviceAccountJsonRaw) {
        const serviceAccountFile = "./serviceAccountJson.json";
        fs.writeFileSync(serviceAccountFile, serviceAccountJsonRaw, {
            encoding: 'utf8'
        });

        // Insure that the api can find our service account credentials
        core.exportVariable("GOOGLE_APPLICATION_CREDENTIALS", serviceAccountFile);
    } else {
        console.log("No service account json key provided!");
        core.setFailed("You must provide one of 'serviceAccountJson' or 'serviceAccountJsonPlainText' to use this action");
    }

    if(!packageName) {
        console.log("Package name is not provided.");
        core.setFailed("Please provide package name through packageName input.");
    }

    if(!releaseFile) {
        console.log("Release file path is not provided.");
        core.setFailed("Please provide release file path through releaseFile input");
    }

    // Acquire an auth client, and bind it to all future calls
    const authClient = await auth.getClient();
    google.options('auth', authClient);

    //TODO Upload bundle

    return "";
}

main().then( (url)=> {
    core.setOutput("url", url)
}).catch ((e)=> {
    core.setFailed(e.message)
})