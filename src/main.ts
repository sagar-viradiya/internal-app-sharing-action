import * as core from '@actions/core'
import * as fs from "fs";
const {google} = require('googleapis');
const androidpublisher = google.androidpublisher('v3');

const auth = new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/androidpublisher']
});

async function main(): Promise<any> {
    const serviceAccountJsonRaw = core.getInput('serviceAccountJson', { required: true });
    const packageName = core.getInput('apkPackageName', { required: true });
    const apkReleaseFile = core.getInput('apkReleaseFile', { required: false });
    const aabReleaseFile = core.getInput('aabReleaseFile', { required: false });

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

    if(!apkReleaseFile && !aabReleaseFile) {
        console.log("Release file path is not provided.");
        core.setFailed("Please provide either apk or aab release file path through apkReleaseFile or aabReleaseFile input");
    }

    // Acquire an auth client, and bind it to all future calls
    const authClient = await auth.getClient();
    google.options('auth', authClient);

    let res;
    if(apkReleaseFile) {
        res = androidpublisher.internalappsharingartifacts.uploadapk({
            packageName: packageName,
            media: {
                mimeType: 'application/octet-stream',
                body: fs.createReadStream(apkReleaseFile)
            }
        })
    } else {
        res = androidpublisher.internalappsharingartifacts.uploadaab({
            packageName: packageName,
            media: {
                mimeType: 'application/octet-stream',
                body: fs.createReadStream(aabReleaseFile)
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