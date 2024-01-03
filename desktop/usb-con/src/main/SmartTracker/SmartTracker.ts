
import { STAuth } from "./auth/STAuth";
import { STApi } from "./api/STApi";
import { STLocalStorage } from "./database/STLocalStorage";
const { app } = require('electron');

// Singleton class

class SmartTracker {

    stAuthInstance: STAuth;
    stApiInstance: STApi;
    localStorage: STLocalStorage;
    token: string | null = null;
    auto_update: boolean = false;
    auto_update_interval: number = 1000 * 60 * 5; // 5 minutes
    private autoUpdateTimeout: NodeJS.Timeout | null = null;

    private static instance: SmartTracker;

    static getInstance() {
        if (!SmartTracker.instance) {
            SmartTracker.instance = new SmartTracker();
        }
        return SmartTracker.instance;
    }

    private constructor() {
        this.stAuthInstance = new STAuth();
        this.authInit();
        this.stApiInstance = new STApi();
        this.localStorage = new STLocalStorage(this.stAuthInstance, this.stApiInstance);
        this.localStorage.init();
    }

    private async authInit() {
        // wait for app to be ready
        await app.whenReady();
        this.stAuthInstance.init();
    }

    private async ping() {
        let response = await this.stAuthInstance.ping()
        return response.success;
    }

    // connect to server:
    connect(username: string, password: string) {
        console.log("Connecting to server...");

        if (this.stAuthInstance.isLoggedin()) {
            this.token = this.stAuthInstance.TOKEN;
            if (this.token) {
                this.stApiInstance.token = this.token;
                console.log("Already logged in with token: " + this.token);
                return;
            }
        }
        if (!username || !password) {
            throw new Error("Username and password required");
        }
        // not logged in, try to login
        this.stAuthInstance.login(username, password)
            .then((result: any) => {
                console.log(result);
                this.token = result.data.token;
                if (!this.token) {
                    console.error("Login failed, no token received.");
                    throw new Error("Login failed, no token received.");
                }
                console.log("Logged in with token: " + this.token);
                this.stApiInstance.token = this.token;
            })
            .catch((err: any) => {
                console.log(err);
            });
    }

    // disconnect from server
    disconnect() {
        this.stAuthInstance.logout();
        this.token = null;
        this.stApiInstance.token = '';
        // TODO: clear last merged and last pushed from local storage
        //      delete all local data?!
        if (this.autoUpdateTimeout) {
            clearTimeout(this.autoUpdateTimeout);
        }
        this.autoUpdateTimeout = null;
        this.autoUpdate = false;
        this.autoUpdateInterval = 1000 * 60 * 5; // 5 minutes
    }

    set autoUpdate(value: boolean) {
        this.auto_update = value;
        if (this.auto_update && this.auto_update_interval && this.auto_update_interval >= 1000) {
            this.startAutoUpdate();
        }
    }

    set autoUpdateInterval(value: number) {
        if (value < 1000) {
            value = 1000;
            console.warn("autoUpdateInterval must be at least 1000ms");
        }
        this.auto_update_interval = value;
        if (this.auto_update) {
            this.startAutoUpdate();
        }
    }

    private startAutoUpdate() {
        // Clear any existing timeout to prevent multiple timeouts
        if (this.autoUpdateTimeout) {
            clearTimeout(this.autoUpdateTimeout);
        }

        if (this.auto_update) {
            this.autoUpdateTimeout = setTimeout(() => {
                console.log("auto update");
                this.update();
                this.startAutoUpdate();
            }, this.auto_update_interval);
        }
    }

    public async manualUpdate() {
        // clear auto update timeout
        if (this.autoUpdateTimeout) {
            clearTimeout(this.autoUpdateTimeout);
        }
        await this.update();
        // restart auto update
        if (this.auto_update) {
            this.startAutoUpdate();
        }
    }

    // update local database from server
    private async update() {
        if (await this.ping() === false) {
            console.error("Server not reachable, cannot update");
            throw new Error("Server not reachable, cannot update");
            return;
        }
        if (!this.stAuthInstance.isLoggedin()) {
            console.error("Not logged in, cannot update");
            throw new Error("Not logged in, cannot update");
            return;
        }
        await this.localStorage.fetchUpdatesFromServer(this.localStorage.LastMerged)
            .then(() => {
                console.log("update done");
            })
            .catch((err) => {
                console.log(err);
            });
        await this.localStorage.syncWithServer();
    }

    get currentUser() {
        return this.stAuthInstance.user;
    }

    get projects() {
        return this.localStorage.getProjects();
    }

    get timeEntries() {
        return this.localStorage.getTimeEntries();
    }

    getProject(id: number) {
        return this.localStorage.getProjectByID(id);
    }

    getTimeEntry(id: number) {
        return this.localStorage.getTimeEntryByID(id);
    }

    getTimeEntriesByProject(projectId: number) {
        return this.localStorage.getProjectTimeEntries(projectId);
    }

    addProject(name: string, description: string) {
        return this.localStorage.addProject(name, description);
    }

    addTimeEntry(projectId: number, description: string, startTime: Date, endTime: Date) {
        return this.localStorage.addTimeEntry(startTime, endTime, description, projectId);
    }

}

export { SmartTracker };