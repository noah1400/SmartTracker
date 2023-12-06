const { app, safeStorage } = require('electron')
const fs = require('fs')

class STAuth {

    BASE_URL = 'http://127.0.0.1:8000'
    PING_URL = this.BASE_URL + '/ping'
    PROTECTED_PING_URL = this.BASE_URL + '/protected-ping'
    LOGIN_URL = this.BASE_URL + '/auth/login'

    loginTypes = {
        OAUTH: 'oauth',
        INTERNAL: 'local'
    }

    AUTH_TYPE = null

    TOKEN = null

    LOGIN_DATA = null



    constructor(baseurl = this.BASE_URL,
        pingURL = this.PING_URL,
        protectedPingURL = this.PROTECTED_PING_URL,
        loginURL = this.LOGIN_URL) {
        this.config = {
            baseurl: baseurl,
            pingURL: pingURL,
            protectedPingURL: protectedPingURL,
            loginURL: loginURL
        }
    }

    init() {
        if (app.isReady()) {
            const authData = this.readAuthData();
            this.AUTH_TYPE = authData.authType;
            this.TOKEN = authData.token;
            this.LOGIN_DATA = authData.loginData;
        } else {
            throw new Error("App is not ready. Call init() after app is ready. See https://www.electronjs.org/docs/api/app#appwhenready");
        }
    }

    prepareAuthDataForStorage(authType, token, loginData) {
        const data = { authType, token, loginData };
        const jsonString = JSON.stringify(data);
        const base64String = Buffer.from(jsonString).toString('base64');
        return base64String;
    }

    saveToDisk(filePath, data) {
        fs.writeFileSync(filePath, data);
    }

    saveAuthData(authType, token, loginData) {
        const base64String = this.prepareAuthDataForStorage(authType, token, loginData);
        console.log("Saving auth data: " + base64String)
        const filePath = app.getPath('userData') + '/auth';

        if (safeStorage.isEncryptionAvailable()) {
            console.log("Encryption available. Saving data encrypted.")
            const encryptedData = safeStorage.encryptString(base64String);
            this.saveToDisk(filePath, encryptedData);
        } else {
            console.warn("Warning: Encryption not available. Saving data in plain text. Ensure your environment supports encryption for enhanced security.");
            // Save data in plain text as a fallback
            this.saveToDisk(filePath, base64String);
        }
    }

    readFromDisk(filePath) {
        return fs.existsSync(filePath) ? fs.readFileSync(filePath) : null;
    }

    decryptData(fileData) {
        return safeStorage.decryptString(fileData);
    }

    parseDataString(dataString) {
        const data = JSON.parse(dataString);
        if (data.authType && data.token && data.loginData) {
            return data;
        } else {
            throw new Error("File structure is incorrect or missing required attributes.");
        }
    }

    readAuthData() {
        const filePath = app.getPath('userData') + '/auth';
        const fileData = this.readFromDisk(filePath);
    
        if (fileData) {
            try {
                let dataString;
    
                if (safeStorage.isEncryptionAvailable()) {
                    const decryptedData = this.decryptData(fileData);
                    dataString = Buffer.from(decryptedData, 'base64').toString();
                } else {
                    console.warn("Warning: Decryption not available. Reading data as plain text.");
                    dataString = Buffer.from(fileData.toString('utf8'), 'base64').toString();
                }
    
                return this.parseDataString(dataString);
            } catch (error) {
                console.error("Error reading auth data: The file is corrupted or unreadable. " + error);
                return { authType: null, token: null, loginData: null };
            }
        }
        return { authType: null, token: null, loginData: null };
    }


    async ping() {
        try {
            const response = await fetch(this.config.pingURL);
            const data = await response.json();
            return { success: (data === 'pong'), error: (data === 'pong' ? null : "Unexpected response") }
        } catch (error) {
            console.error(error);
            return { success: false, error: error };
        }
    }

    async protectedPing() {
        if (!this.isLoggedin()) {
            return { success: false, error: "Not logged in" };
        }
        try {
            const response = await fetch(this.config.protectedPingURL, {
                headers: {
                    "Authorization": "Bearer " + this.TOKEN
                }
            });
            const data = await response.json();
            return { success: (data === 'protected pong'), error: (data === 'protected pong' ? null : "Unexpected response") }
        } catch (error) {
            console.error(error);
            return { success: false, error: error };
        }
    }

    async login(username, password) {
        if (this.isLoggedin()) {
            return { success: true, error: "Already logged in" };
        }
        try {
            const response = await fetch(this.config.loginURL, {
                method: 'POST',
                body: JSON.stringify({
                    username: username,
                    password: password
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (data.token) {
                this.TOKEN = data.token;
                this.AUTH_TYPE = this.loginTypes.INTERNAL;
                this.LOGIN_DATA = data;
                this.saveAuthData(this.AUTH_TYPE, this.TOKEN, this.LOGIN_DATA);
            } else {
                return { success: false, error: "No token returned" };
            }
            return { success: true, error: null, data: data };
        } catch (error) {
            console.error(error);
            return { success: false, error: error, data: null };
        }
    }


    isLoggedin() {
        let tokenConditions = this.TOKEN !== null && this.TOKEN !== undefined && this.TOKEN !== '';
        let authTypeConditions = this.AUTH_TYPE !== null && this.AUTH_TYPE !== undefined && this.AUTH_TYPE !== '';
        return tokenConditions && authTypeConditions;
    }

    get token() {
        return this.TOKEN;
    }

    get authType() {
        return this.AUTH_TYPE;
    }

    get loginData() {
        return this.LOGIN_DATA;
    }

    async oauthLogin(service, username, password) {

    }



}

module.exports = { STAuth };