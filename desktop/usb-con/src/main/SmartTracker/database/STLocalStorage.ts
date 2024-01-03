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
  LastPushed: any;
  stAuthInstance: any;
  stApiInstance: any;
  databaseFileCreated: boolean = false;

  constructor(STAuth: any, STApi: any) {
    // check if database file exists
    const filePath = 'database.sqlite';
    if (this.checkIfFileExists(filePath)) {
      this.databaseFileCreated = true;
    }
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

  checkIfFileExists(filePath: string) {
    try {
      if (fs.access(filePath).then(() => true).catch(() => false)) {
        console.log('database file exists');
        return true;
      } else {
        console.log('database file does not exist');
        return false;
      }
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  set authInstance(stAuthInstance: any) {
    this.stAuthInstance = stAuthInstance;
  }

  set apiInstance(stApiInstance: any) {
    this.stApiInstance = stApiInstance;
  }

  async init() {
    await this.sequelize.sync();
    if (this.databaseFileCreated) {
      this.LastMerged = new Date(0);
    } else {
      try {
        const filePathMerged = path.join(
          app.getPath('userData'),
          'last-merged.txt',
        );
        let timestampStrMerged = await fs.readFile(filePathMerged, 'utf8');
        this.LastMerged = new Date(timestampStrMerged);
        console.log('Last merged timestamp loaded from disk.');
      } catch (error) {
        console.warn(
          'Error loading last merged timestamp from disk or file not found. Defaulting to new Date(0).',
          error,
        );
        this.LastMerged = new Date(0);
      }
    }

    if (this.databaseFileCreated) {
      this.LastPushed = new Date(0);
    } else {
      try {
        const filePathPushed = path.join(
          app.getPath('userData'),
          'last-pushed.txt',
        );
        let timestampStrPushed = await fs.readFile(filePathPushed, 'utf8');
        this.LastPushed = new Date(timestampStrPushed);
        console.log('Last pushed timestamp loaded from disk.');
      } catch (error) {
        console.warn(
          'Error loading last pushed timestamp from disk or file not found. Defaulting to new Date(0).',
          error,
        );
        this.LastPushed = new Date(0);
      }
    }
  }

  addProject(name: string, description: string) {

    // validate input
    if (!name) {
      throw new Error('Project name is required.');
    }

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

    // validate input
    if (!startTime) {
      throw new Error('Start time is required.');
    }
    // check if startTime is date ( try to convert to date from string or number)
    if (isNaN(startTime.getTime())) {
      throw new Error('Start time is not a valid date.');
    }
    if (!endTime) {
      throw new Error('End time is required.');
    }
    // check if endTime is date ( try to convert to date from string or number)
    if (isNaN(endTime.getTime())) {
      throw new Error('End time is not a valid date.');
    }
    if (startTime > endTime) {
      throw new Error('Start time must be before end time.');
    }
    if (!projectId) {
      throw new Error('Project ID is required.');
    }


    this.TimeEntry.create({
      startTime: startTime,
      endTime: endTime,
      description: description,
      projectId: projectId,
    });
  }

  async getProjects() {
    const projects = await this.Project.findAll();
    return projects;
  }

  async getTimeEntries() {
    const timeEntries = await this.TimeEntry.findAll();
    return timeEntries;
  }

  async getProjectTimeEntries(projectID: number) {
    const timeEntries = await this.TimeEntry.findAll({
      where: {
        projectID: projectID,
      },
    });
    return timeEntries;
  }

  async getProjectTimeEntriesByServerID(serverProjectID: number) {
    const timeEntries = await this.TimeEntry.findAll({
      where: {
        serverProjectID: serverProjectID,
      },
    });
    return timeEntries;
  }

  async getProjectByID(projectID: number) {
    const project = await this.Project.findOne({
      where: {
        localID: projectID,
      },
    });
    return project;
  }

  async getProjectByServerID(serverProjectID: number) {
    const project = await this.Project.findOne({
      where: {
        serverID: serverProjectID,
      },
    });
    return project;
  }

  async getTimeEntryByID(timeEntryID: number) {
    const timeEntry = await this.TimeEntry.findOne({
      where: {
        localID: timeEntryID,
      },
    });
    return timeEntry;
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

    console.log('syncWithServer...')

    const updatedProjects = await this.Project.findAll({
      where: {
        updatedAt: {
          [Op.gt]: this.LastPushed,
        },
      },
    });

    const updatedTimeEntries = await this.TimeEntry.findAll({
      where: {
        updatedAt: {
          [Op.gt]: this.LastPushed,
        },
      },
    });

    // check if there are any updates to sync
    if (updatedProjects.length === 0 && updatedTimeEntries.length === 0) {
      console.log('No updates to sync.');
      return;
    }

    // only add project.dataValues and timeEntry.dataValues to dataToMerge
    const dataToMerge = {
      "projects": updatedProjects.map((p: any) => p.dataValues),
      "timeEntries": updatedTimeEntries.map((te: any) => te.dataValues),
    };

    console.log('dataToMerge: ', dataToMerge);

    try {
      let response = await this.stApiInstance.post('/merge', dataToMerge);
      console.log('response in sync: ', response);
      if (response.status === 'success') {
        const { projects, timeEntries } = response.data;

        console.log('projects in sync: ', projects);
        console.log('timeEntries in sync: ', timeEntries);

        for (const project in projects) {
          await this.updateProjectServerID(project.localID, project.serverID);
        }

        for (const entry in timeEntries) {
          await this.updateTimeEntryServerID(entry.localID, entry.serverID);
        }

        this.updateLastPushedTimestamp(new Date());
      }
    } catch (error) {
      console.error(error);
    }
  }

  async updateProjectServerID(localID: Number, serverID: Number) {
    const project = await this.Project.findOne({ where: { localID: localID } });
    if (project) {
      await project.update({ serverID: serverID });
    }
  }

  async updateTimeEntryServerID(localID: Number, serverID: Number) {
    const entry = await this.TimeEntry.findOne({ where: { localID: localID } });
    if (entry) {
      await entry.update({ serverID: serverID });
    }
  }

  async fetchUpdatesFromServer(lastMerged: Date) {

    console.log('fetchUpdatesFromServer...')

    let timestamp = lastMerged.toISOString();
    try {
      let response = await this.stApiInstance.get('/fetch-updates', {
        'last-merged': timestamp,
      });

      // Extract the projects and time entries from the server response
      // const { projects, timeEntries } = response.data;
      console.log('response: ', response);
      const projects = response.projects;
      console.log('projects: ', projects);
      const timeEntries = response.timeEntries;
      console.log('timeEntries: ', timeEntries);

      // check if there are any updates to sync
      if (projects.length === 0 && timeEntries.length === 0) {
        console.log('No updates to sync.');
        return;
      }

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
        console.log('Updating existing project')
        await existingProject.update(project);
      } else {
        console.log('Creating new project')
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
        console.log('Updating existing time entry')	
        await existingEntry.update({ ...entry, serverID: entry.id, projectID: projectLocalID, serverProjectID: entry.projectId });
      } else {
        // Create a new time entry with the serverID, local project ID, and server project ID^
        console.log('Creating new time entry')
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

  async updateLastPushedTimestamp(timestamp: Date) {
    try {
      this.LastPushed = timestamp;
      const filePath = path.join(app.getPath('userData'), 'last-pushed.txt');
      await fs.writeFile(filePath, timestamp.toISOString());
      console.log('Last pushed timestamp updated successfully.');
    } catch (error) {
      console.error('Error updating last pushed timestamp:', error);
    }
  }
}

export { STLocalStorage };
