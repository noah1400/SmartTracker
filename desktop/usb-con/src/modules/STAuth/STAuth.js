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
        const authData = this.readAuthData();
        this.AUTH_TYPE = authData.authType;
        this.TOKEN = authData.token;
        this.LOGIN_DATA = authData.loginData;

    }

    saveAuthData(authType, token, loginData) {
        const data = { authType, token, loginData };
        const jsonString = JSON.stringify(data);
        const base64String = Buffer.from(jsonString).toString('base64');
        console.log("Saving auth data: " + base64String)
        const filePath = app.getPath('userData') + '/auth';

        if (safeStorage.isEncryptionAvailable()) {
            console.log("Encryption available. Saving data encrypted.")
            const encryptedData = safeStorage.encryptString(base64String);
            fs.writeFileSync(filePath, encryptedData);
        } else {
            console.warn("Warning: Encryption not available. Saving data in plain text. Ensure your environment supports encryption for enhanced security.");
            // Save data in plain text as a fallback
            fs.writeFileSync(filePath, base64String);
        }
    }

    readAuthData() {
        console.log("Reading auth data")
        const filePath = app.getPath('userData') + '/auth';

        if (fs.existsSync(filePath)) {
            try {
                // Read the file as a Buffer
                const fileData = fs.readFileSync(filePath);

                let dataString;

                if (safeStorage.isEncryptionAvailable()) {
                    // Decrypt the data (expecting a Buffer)
                    const decryptedData = safeStorage.decryptString(fileData);
                    // Convert decrypted data to a string from base64
                    dataString = Buffer.from(decryptedData, 'base64').toString();
                } else {
                    console.warn("Warning: Decryption not available. Reading data as plain text.");
                    // Convert file data to a string from base64
                    dataString = Buffer.from(fileData.toString('utf8'), 'base64').toString();
                }

                const data = JSON.parse(dataString);

                // Check if all required attributes are present
                if (data.authType && data.token && data.loginData) {
                    return data;
                } else {
                    throw new Error("File structure is incorrect or missing required attributes.");
                }
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
                await this.saveAuthData(this.AUTH_TYPE, this.TOKEN, this.LOGIN_DATA);
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

    async oauthLogin(service, username, password) {

    }



}

module.exports = { STAuth };