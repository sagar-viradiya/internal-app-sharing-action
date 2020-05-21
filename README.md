# Internal App Sharing
GitHub Action to upload aab/apk to Internal App Sharing on Play console.

## Inputs

### `serviceAccountJsonPlainText`
**Required:** Service account JSON in plain text to authenticate upload request. Note that it should be in the plain text and not in actual JSON file format so we recommend setting it as a GitHub secret and then pass it to input.

### `packageName`
**Required:** Your application's package name(Application ID).

### `apkFilePath`
Path to your application's apk file.

### `aabFilePath`
Path to your application's aab file.

## Output

### `downloadUrl`
The download URL generated for the uploaded artifact.

### `certificateFingerprint`
The SHA256 fingerprint of the certificate used to sign the generated artifact.

### `sha256`
The SHA-256 hash of the artifact.


## Sample for uploading aab
```yml
uses: sagar-viradiya/internal-app-sharing-action@v1
with:
  serviceAccountJsonPlainText: ${{ secrets.<your-github-service-acc-json-secret> }}
  packageName: <your-package-name>
  aabFilePath: <path-to-aab>
```

## Sample for uploading apk
```yml
uses: sagar-viradiya/internal-app-sharing-action@v1
with:
  serviceAccountJsonPlainText: ${{ secrets.<your-github-service-acc-json-secret> }}
  packageName: <your-package-name>
  apkFilePath: <path-to-apk>
```
