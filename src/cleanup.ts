import * as fs from "fs";
const serviceAccountFile = "./serviceAccount.json";
try {
    fs.unlinkSync(serviceAccountFile)
} catch (err) {
    console.log(err.message)
}