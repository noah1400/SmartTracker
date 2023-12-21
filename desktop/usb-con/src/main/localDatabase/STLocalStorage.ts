import { Sequelize } from "sequelize";
import { ModelProvider } from "./STModels";


class STLocalStorage {
    sequelize: any;
    Project: any;
    TimeEntry: any;
    LastMerged: any;

    constructor() {
        this.sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: 'database.sqlite'
        });
        const modelProvider = new ModelProvider(this.sequelize);
        modelProvider.createModels();
        this.Project = modelProvider.Project;
        this.TimeEntry = modelProvider.TimeEntry;
    }

    init() {
        this.sequelize.sync();
    }


    serialize() {
        // TODO: send data to server
        //       which was created after the last merge
        //       projects first, then time entries (with project id)
        //       send data in chunks ( 100 projects, 100 time entries ) to avoid timeouts and reduce server load
    }

    deserialize() {
        // TODO: get data ( last merge date ) from disk
        //       get data from server ( projects, time entries ( only current user ) )
        //       merge data with local sqlite database
        //       update last merge date
    }
}





export { STLocalStorage };