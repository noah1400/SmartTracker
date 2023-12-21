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

    init() {
        this.sequelize.sync();
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
            if ( response.status === 200 ) {
                this.LastMerged = new Date();
            }
        } catch (error) {
            console.error(error);
        }
    }

    deserialize() {
        // TODO: get data ( last merge date ) from disk
        //       get data from server ( projects, time entries ( only current user ) )
        //       merge data with local sqlite database
        //       update last merge date
    }
}





export { STLocalStorage };
