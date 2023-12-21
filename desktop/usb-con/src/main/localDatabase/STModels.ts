import { DataTypes } from "sequelize";


class ModelProvider {
    sequelize: any;
    Project: any;
    TimeEntry: any;
    constructor(sequelize: any) {
        this.sequelize = sequelize;
        this.createModels();
    }

    createModels() {
        const Project = this.sequelize.define('project', {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        });



        // TimeEntry Model
        const TimeEntry = this.sequelize.define('timeEntry', {
            startTime: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            endTime: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        });

        Project.hasMany(TimeEntry, { as: 'timeEntries' });
        TimeEntry.belongsTo(Project, { as: 'project' });
        this.Project = Project;
        this.TimeEntry = TimeEntry;
    }

    getProjectModel() {
        return this.Project;
    }

    getTimeEntryModel() {
        return this.TimeEntry;
    }

}

export { ModelProvider };
