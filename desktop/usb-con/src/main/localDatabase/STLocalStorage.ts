import { Sequelize, Op } from 'sequelize';
import { ModelProvider } from './STModels';
const { app } = require('electron');
const fs = require('fs').promises;
const path = require('path');

class STLocalStorage {
  sequelize: any;
  Project: any;
  TimeEntry: any;
  LastMerged: any;
  stAuthInstance: any;
  stApiInstance: any;

  constructor(STAuth: any, STApi: any) {
    this.sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: 'database.sqlite',
      logging: false,
    });
    const modelProvider = new ModelProvider(this.sequelize);
    modelProvider.createModels();
    this.Project = modelProvider.getProjectModel();
    this.TimeEntry = modelProvider.getTimeEntryModel();
    this.stApiInstance = STApi;
    this.stAuthInstance = STAuth;
  }

  async init() {
    try {
      await this.sequelize.sync();
      const filePath = path.join(
        app.getPath('userData'),
        'lastMergedTimestamp.txt',
      );
      let timestampStr = await fs.readFile(filePath, 'utf8');
      this.LastMerged = new Date(timestampStr);
      console.log('Last merged timestamp loaded from disk.');
    } catch (error) {
      console.warn(
        'Error loading last merged timestamp from disk or file not found. Defaulting to new Date(0).',
        error,
      );
      this.LastMerged = new Date(0);
    }
  }

  addProject(name: string, description: string) {
    this.Project.create({
      name: name,
      description: description,
    });
  }

  addTimeEntry(
    startTime: Date,
    endTime: Date,
    description: string,
    projectId: number,
  ) {
    this.TimeEntry.create({
      startTime: startTime,
      endTime: endTime,
      description: description,
      projectId: projectId,
    });
  }

  async dumpDatabase() {
    const projects = await this.Project.findAll();
    const timeEntries = await this.TimeEntry.findAll();
    console.log('dumpDatabase');
    console.log('Projects: ');

    const projectsData = projects.map((p: any) => {
      const projectData = p.dataValues;
      // get time entries for this project
      projectData.timeEntries = timeEntries
        .filter((te: any) => te.dataValues.projectID === p.dataValues.localID)
        .map((te: any) => te.dataValues); // convert each timeEntry to its dataValues

      return projectData;
    });

    console.log(JSON.stringify(projectsData, null, 2));
  }

  async databaseSize() {
    const projects = await this.Project.findAll();
    const timeEntries = await this.TimeEntry.findAll();
    console.log('databaseSize');
    console.log('Projects: ');
    console.log(projects.length);
    console.log('TimeEntries: ');
    console.log(timeEntries.length);
    // output first 2 projects with 2 time entries each
    console.log('Projects: ');
    console.log(projects.slice(0, 2).map((p: any) => {
      return p.dataValues;
    }));
    console.log('TimeEntries: ');
    console.log(timeEntries.slice(0, 2).map((p: any) => {
      return p.dataValues;
    }));

  }

  async syncWithServer() {
    const updatedProjects = await this.Project.findAll({
      where: {
        updatedAt: {
          [Op.gt]: this.LastMerged,
        },
      },
    });

    const updatedTimeEntries = await this.TimeEntry.findAll({
      where: {
        updatedAt: {
          [Op.gt]: this.LastMerged,
        },
      },
    });

    const dataToMerge = {
      projects: updatedProjects,
      timeEntries: updatedTimeEntries,
    };

    try {
      let response = await this.stApiInstance.post('/merge', dataToMerge);
      console.log(response);
      if (response.status === 200) {
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
        'last-merged': timestamp,
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
      console.error('Error while fetching updates: ', error);
    }
  }

  async mergeProjectWithLocalDB(project: any) {
    try {
      // Use 'id' from the server as 'serverID' in the local database
      const existingProject = await this.Project.findOne({
        where: { serverID: project.id },
      });

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
      // Find the local project ID based on the serverProjectID (which is the serverID of the project)
      const project = await this.Project.findOne({ where: { serverID: entry.projectId } });
      const projectLocalID = project ? project.localID : null;

      // Handle the time entry
      const existingEntry = await this.TimeEntry.findOne({ where: { serverID: entry.id } });

      if (existingEntry) {
        // Update the existing entry with the new data and the local project ID
        await existingEntry.update({ ...entry, serverID: entry.id, projectID: projectLocalID, serverProjectID: entry.projectId });
      } else {
        // Create a new time entry with the serverID, local project ID, and server project ID
        await this.TimeEntry.create({ ...entry, serverID: entry.id, projectID: projectLocalID, serverProjectID: entry.projectId });
      }

      console.log(`Time Entry merged successfully.`);
    } catch (error) {
      console.error(`Error merging time entry:`, error);
    }
  }

  async updateLastMergedTimestamp(timestamp: Date) {
    try {
      this.LastMerged = timestamp;
      const filePath = path.join(app.getPath('userData'), 'last-merged.txt');
      await fs.writeFile(filePath, timestamp.toISOString());
      console.log('Last merged timestamp updated successfully.');
    } catch (error) {
      console.error('Error updating last merged timestamp:', error);
    }
  }
}

export { STLocalStorage };
