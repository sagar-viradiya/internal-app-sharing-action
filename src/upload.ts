import * as fs from 'fs';

// Type picked up from https://developers.google.com/android-publisher/api-ref/internalappsharingartifacts#resource-representations
export type InternalAppSharingArtifact = {
    downloadUrl: string,
    certificateFingerprint: string,
    sha256: string
}

export async function uploadFile(accessToken: String, path: string, packageName: string): Promise<string> {
    const fileToUpload = fs.readFileSync(path, 'utf8')
    const uploadURL: string = `https://www.googleapis.com/upload/androidpublisher/v3/applications/internalappsharing/${packageName}/artifacts/apk?uploadType=media`;
    const uploadAPIResult = await fetch(uploadURL, {
        headers: {
            "Content-Type": "application/octet-stream",
            "Authorization": `Bearer ${accessToken}`
        },
        method: "POST",
        body: fileToUpload,
    });

    const uploadResult: InternalAppSharingArtifact = await (uploadAPIResult.json() as Promise<InternalAppSharingArtifact>);

    return uploadResult.downloadUrl;
}