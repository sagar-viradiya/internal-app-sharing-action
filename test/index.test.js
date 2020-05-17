jest.mock('@actions/core');

// Global imports
const mockCore = require('@actions/core');
const actualCore = jest.requireActual('@actions/core');
const when = require("jest-when").when;

// Local imports
const getAndValidateInputs = require("../lib/main").getAndValidateInputs;
const setGoogleCredentials = require("../lib/main").setGoogleCredentials;
const fs = require("fs");

afterAll(() => {
    try {
        fs.unlinkSync("./serviceAccountJson.json");
    } catch(e) {
        console.log("Error in test teardown: ", e.message);
    }
})

test("Test that input validation succeeds if both apk and aab paths are provided", () => {
    mockCore.getInput = jest.fn();
    when(mockCore.getInput).calledWith("apkFilePath").mockReturnValue("some-path");
    when(mockCore.getInput).calledWith("aabFilePath").mockReturnValue("some-path");
    getAndValidateInputs();
})

test("Test that input validation succeeds if only apk path is provided", () => {
    mockCore.getInput = jest.fn();
    when(mockCore.getInput).calledWith("apkFilePath").mockReturnValue("some-path");
    when(mockCore.getInput).calledWith("aabFilePath").mockReturnValue(undefined);
    getAndValidateInputs();
})

test("Test that input validation succeeds if only aab path is provided", () => {
    mockCore.getInput = jest.fn();
    when(mockCore.getInput).calledWith("apkFilePath").mockReturnValue(undefined);
    when(mockCore.getInput).calledWith("aabFilePath").mockReturnValue("some-path");
    getAndValidateInputs();
})

test("Test that input validation fails if both apk and aab path is missing", () => {
    mockCore.getInput = jest.fn();
    when(mockCore.getInput).calledWith("apkFilePath").mockReturnValue(undefined);
    when(mockCore.getInput).calledWith("aabFilePath").mockReturnValue(undefined);
    try {
        getAndValidateInputs();
        throw new Error("Test failed");
    } catch(e) {
        expect(e.message).toBe("You must provide either 'apkFilePath' or 'aabFilePath' to use this action");
    }
})

test("Test that provided json is set correctly as environment variables", () => {
    const jsonString = JSON.stringify({test: "test"});
    mockCore.getInput = jest.fn();
    when(mockCore.getInput).calledWith("serviceAccountJsonPlainText").mockReturnValue(jsonString);
    when(mockCore.getInput).calledWith("apkFilePath").mockReturnValue("some-path");
    when(mockCore.getInput).calledWith("aabFilePath").mockReturnValue(undefined);
    mockCore.exportVariable = actualCore.exportVariable;
    getAndValidateInputs();
    setGoogleCredentials();
    expect(process.env["GOOGLE_APPLICATION_CREDENTIALS"]).toBe(jsonString);
})