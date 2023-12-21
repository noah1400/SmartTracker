import { Sequelize, Op } from "sequelize";
import { ModelProvider } from "./STModels";


class STLocalStorage {
    sequelize: any;
    Project: any;
    TimeEntry: any;
    LastMerged: any;
    stAuthInstance: any;
    stApiInstance: any;

    constructor( STAuth: any, STApi: any ) {
        this.sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: 'database.sqlite'
        });
        const modelProvider = new ModelProvider(this.sequelize);
        modelProvider.createModels();
        this.Project = modelProvider.getProjectModel();
        this.TimeEntry = modelProvider.getTimeEntryModel();
        this.stApiInstance = STApi;
        this.stAuthInstance = STAuth;
    }

    async init() {
        await this.sequelize.sync();
        // For now!!!
        this.LastMerged = new Date(0); // TODO: change this ( get from disk ) -> and save to disk if changed
    }

    addProject(name: string, description: string) {
        this.Project.create({
            name: name,
            description: description
        });
    }

    addTimeEntry(startTime: Date, endTime: Date, description: string, projectId: number) {
        this.TimeEntry.create({
            startTime: startTime,
            endTime: endTime,
            description: description,
            projectId: projectId
        });
    }

    async dumpDatabase() {
        const projects = await this.Project.findAll()
        const timeEntries = await this.TimeEntry.findAll()
        console.log('dumpDatabase')
        console.log("Projects: ")
        console.log(projects);
        console.log("TimeEntries: ")
        console.log(timeEntries);
    }


    async syncWithServer() {
        const updatedProjects = await this.Project.findAll({
            where: {
                updatedAt: {
                    [Op.gt]: this.LastMerged
                }
            }
        });

        const updatedTimeEntries = await this.TimeEntry.findAll({
            where: {
                updatedAt: {
                    [Op.gt]: this.LastMerged
                }
            }
        });

        const dataToMerge = {
            projects: updatedProjects,
            timeEntries: updatedTimeEntries
        };
        
        try {
            let response = await this.stApiInstance.post('/merge', dataToMerge);
            console.log(response);
            if ( response.status === 200 ) {
                this.LastMerged = new Date();
            }
        } catch (error) {
            console.error(error);
        }
    }

    async fetchUpdatesFromServer(lastMerged: Date) {
        let timestamp = lastMerged.toISOString();
        try {
            let response = await this.stApiInstance.get('/fetch-updates', {
                'last-merged': timestamp
            });
    
            // Extract the projects and time entries from the server response
            // const { projects, timeEntries } = response.data;
            const projects = response.projects;
            const timeEntries = response.timeEntries;
    
            // Update local projects database
            for (const project of projects) {
                await this.mergeProjectWithLocalDB(project);
            }
    
            // Update local time entries database
            for (const entry of timeEntries) {
                await this.mergeTimeEntryWithLocalDB(entry);
            }
    
            // Update the lastMerged timestamp in your local storage
            // Assuming you have a method like this
            await this.updateLastMergedTimestamp(new Date());
    
            console.log('Updates fetched and merged successfully.');
    
        } catch (error) {
            console.error("Error while fetching updates: ", error);
        }
    }

    async mergeProjectWithLocalDB(project: any) {
        try {
            // Use 'id' from the server as 'serverID' in the local database
            const existingProject = await this.Project.findOne({ where: { serverID: project.id } });
    
            if (existingProject) {
                // Update the existing project
                await existingProject.update(project);
            } else {
                // Create a new project with the serverID
                await this.Project.create({ ...project, serverID: project.id });
            }
    
            console.log(`Project '${project.name}' merged successfully.`);
        } catch (error) {
            console.error(`Error merging project '${project.name}':`, error);
        }
    }

    async mergeTimeEntryWithLocalDB(entry: any) {
        try {
            // Use 'id' from the server as 'serverID' in the local database
            const existingEntry = await this.TimeEntry.findOne({ where: { serverID: entry.id } });
    
            if (existingEntry) {
                // Update the existing entry
                await existingEntry.update(entry);
            } else {
                // Create a new time entry with the serverID
                await this.TimeEntry.create({ ...entry, serverID: entry.id });
            }
    
            console.log(`Time Entry merged successfully.`);
        } catch (error) {
            console.error(`Error merging time entry:`, error);
        }
    }

    async updateLastMergedTimestamp(timestamp: Date) {
        this.LastMerged = timestamp;
    }
    
    

    deserialize() {
        // TODO: get data ( last merge date ) from disk
        //       get data from server ( projects, time entries ( only current user ) )
        //       merge data with local sqlite database
        //       update last merge date
    }
}





export { STLocalStorage };
