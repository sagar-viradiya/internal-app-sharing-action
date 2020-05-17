# Internal App Sharing
GitHub Action to upload aab/apk to Internal App Sharing on Play console.

## Inputs

### `serviceAccountJsonPlainText`
**Required:** Service account JSON in plain text to authenticate upload request. Note that it should be in the plain text and not actual JSON file format so we recommend to set it as GitHub secret and then pass it to input.

### `packageName`
**Required:** Your application's package name(Application ID).

### `apkFilePath`
Path to your application's apk file.

### `aabFilePath`
Path to your application's aab file.

