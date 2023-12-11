const { app, safeStorage } = require('electron');
const fs = require('fs');
const jose = require('jose');

class STAuth {
    constructor(baseurl = 'http://127.0.0.1:8000') {
        this.BASE_URL = baseurl;
        this.PING_URL = `${this.BASE_URL}/ping`;
        this.PROTECTED_PING_URL = `${this.BASE_URL}/protected-ping`;
        this.LOGIN_URL = `${this.BASE_URL}/auth/login`;
        this.AUTH_FILE_PATH = app.getPath('userData') + '/auth';
        this.loginTypes = {
            OAUTH: 'oauth',
            INTERNAL: 'local'
        };
        this.AUTH_TYPE = null;
        this.TOKEN = null;
        this.LOGIN_DATA = null;
    }

    init() {
        if (!app.isReady()) {
            throw new Error("App is not ready. Call init() after app is ready. See https://www.electronjs.org/docs/api/app#appwhenready");
        }
        this.readAuthData();
    }

    readAuthData() {
        const fileData = this.readFromDisk(this.AUTH_FILE_PATH);
        if (!fileData?.length) {
            return;
        }

        let dataString;
        try {
            if (this.isEncryptionAvailable()) {
                dataString = this.decryptData(fileData);
            }
            dataString = Buffer.from(dataString, 'base64').toString();
            const data = JSON.parse(dataString);
            this.assignAuthData(data);
        } catch (error) {
            console.error("Error reading auth data: " + error);
            this.clearAuthData();
        }
    }

    assignAuthData(data) {
        if (data.authType && data.token && data.loginData) {
            this.AUTH_TYPE = data.authType;
            this.TOKEN = data.token;
            this.LOGIN_DATA = data.loginData;
        } else {
            this.clearAuthData();
        }
    }

    isEncryptionAvailable() {
        return safeStorage.isEncryptionAvailable();
    }

    prepareAuthDataForStorage(authType, token, loginData) {
        const data = { authType, token, loginData };
        return Buffer.from(JSON.stringify(data)).toString('base64');
    }

    saveToDisk(filePath, data) {
        try {
            fs.writeFileSync(filePath, data);
        } catch (error) {
            console.error("Error saving to disk: " + error);
        }
    }

    saveAuthData(authType, token, loginData) {
        const base64String = this.prepareAuthDataForStorage(authType, token, loginData);
        const encryptedData = this.isEncryptionAvailable() ? safeStorage.encryptString(base64String) : base64String;
        this.saveToDisk(this.AUTH_FILE_PATH, encryptedData);
    }

    readFromDisk(filePath) {
        try {
            return fs.existsSync(filePath) ? fs.readFileSync(filePath) : null;
        } catch (error) {
            console.error("Error reading from disk: " + error);
            return null;
        }
    }

    decryptData(fileData) {
        try {
            return safeStorage.decryptString(fileData);
        } catch (error) {
            console.error("Error decrypting data: " + error);
            return null;
        }
    }

    async ping() {
        try {
            const response = await fetch(this.PING_URL);
            const data = await response.json();
            return { success: data === 'pong', error: data === 'pong' ? null : "Unexpected response" };
        } catch (error) {
            console.error(error);
            return { success: false, error: error.message };
        }
    }

    async protectedPing() {
        if (!this.isLoggedin()) {
            return { success: false, error: "Not logged in" };
        }
        try {
            const response = await fetch(this.PROTECTED_PING_URL, {
                headers: {
                    "Authorization": "Bearer " + this.TOKEN
                }
            });
            const data = await response.json();
            return { success: data === 'protected pong', error: data === 'protected pong' ? null : "Unexpected response" };
        } catch (error) {
            console.error(error);
            return { success: false, error: error.message };
        }
    }

    async login(username, password) {
        const isSameUser = this.isSameUser(username);
        if (!isSameUser && isSameUser !== null) {
            this.logout();
        }
        if (this.isLoggedin()) {
            const pingResponse = await this.protectedPing();
            if (pingResponse.success) {
                return { success: true, error: "Already logged in" };
            }
        } else {
            this.clearAuthData();
        }

        const response = await this.makeLoginRequest(username, password);
        return await this.handleLoginResponse(response);
    }

    async makeLoginRequest(username, password) {
        try {
            return await fetch(this.LOGIN_URL, {
                method: 'POST',
                body: JSON.stringify({ username, password }),
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async handleLoginResponse(response) {
        if (!response) {
            return { success: false, error: "Login request failed", data: null };
        }

        if (response.status !== 200) {
            return { success: false, error: "Login failed" };
        }

        const data = await response.json();
        if (!data.token) {
            return { success: false, error: "No token returned" };
        }

        this.processLoginSuccess(data);
        return { success: true, error: null, data };
    }

    processLoginSuccess(data) {
        this.TOKEN = data.token;
        this.AUTH_TYPE = this.loginTypes.INTERNAL;
        this.LOGIN_DATA = data;
        this.saveAuthData(this.AUTH_TYPE, this.TOKEN, this.LOGIN_DATA);
    }

    clearAuthData() {
        this.TOKEN = null;
        this.AUTH_TYPE = null;
        this.LOGIN_DATA = null;
    }

    logout() {
        if (!this.isLoggedin()) {
            return;
        }

        this.clearAuthData();
        this.saveToDisk(this.AUTH_FILE_PATH, '');
    }

    isLoggedin() {
        return this.TOKEN && this.AUTH_TYPE && this.LOGIN_DATA && !this.isTokenExpired();
    }

    getTokenClaims() {
        if (!this.TOKEN) {
            return null;
        }
        try {
            return jose.decodeJwt(this.TOKEN);
        } catch (error) {
            console.error("Error decoding JWT: " + error);
            return null;
        }
    }

    isTokenExpired() {
        const claims = this.getTokenClaims();
        if (!claims) {
            return true;
        }
        const now = Math.floor(Date.now() / 1000);
        return claims.exp < now;
    }

    isSameUser(username) {
        const claims = this.getTokenClaims();
        return claims && claims.sub === username;
    }

    get token() {
        return this.TOKEN;
    }
}

module.exports = { STAuth };