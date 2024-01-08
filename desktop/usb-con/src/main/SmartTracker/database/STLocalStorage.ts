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

  set authInstance(stAuthInstance: any) {
    this.stAuthInstance = stAuthInstance;
  }

  set apiInstance(stApiInstance: any) {
    this.stApiInstance = stApiInstance;
  }

  async init() {
    await this.sequelize.sync();
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
      this.updateLastMergedTimestamp(new Date(0))
    }

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
      this.updateLastPushedTimestamp(new Date(0))
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
      projectID: projectId,
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

  async prepareDataForServer() {
    // get all projects
    // get all time entries
    // get all time entries for each project
    // return object with projects and time entries

    console.log('last pushed: ', this.LastPushed)

    let projects = await this.Project.findAll({
      where: {
        updatedAt: {
          [Op.gt]: new Date(this.LastPushed),
        },
      },
    });

    let timeEntries = await this.TimeEntry.findAll({
      where: {
        updatedAt: {
          [Op.gt]: new Date(this.LastPushed),
        },
      },
    });

    timeEntries = timeEntries.map((te: any) => {
      return te.dataValues;
    })

    projects = projects.map((p: any) => {
      return p.dataValues;
    })

    const dataToPush = {
      projects: projects,
      timeEntries: timeEntries,
    };

    // add all projects of time entries that are not already in projects
    for (const timeEntry of timeEntries) {
      if (!projects.some((p: any) => p.localID === timeEntry.projectID)) {
        const project = await this.getProjectByID(timeEntry.projectID);
        if (project) {
          projects.push(project.dataValues);
        }
      }
    }
    return dataToPush;
  }

  async syncWithServer() {

    const dataToMerge = await this.prepareDataForServer();
    // check if there is anything to push
    if (dataToMerge.projects.length === 0 && dataToMerge.timeEntries.length === 0) {
      console.log('Nothing to push');
      return;
    }

    try {
      let response = await this.stApiInstance.post('/merge', dataToMerge);

      if (response && response.status === "success") {

        const { projects, timeEntries } = response;

        for (const project of projects) {
          // find local project by localID
          const localProject = await this.getProjectByID(project.localID);
          // update local project with serverID
          await localProject.update({
            serverID: project.serverID,
          });
        }

        for (const entry of timeEntries) {
          // find local time entry by localID
          const localTimeEntry = await this.getTimeEntryByID(entry.localID);
          // update local time entry with serverID
          await localTimeEntry.update({
            serverID: entry.serverID,
          });
        }

        // update last pushed timestamp
        await this.updateLastPushedTimestamp(new Date());

      } else {
        console.error('Error merging:', response.data);
      }

    } catch (error) {
      console.error(error);
    }
  }

  async updateProjectServerID(localID: number, serverID: number) {
    const project = await this.Project.findOne({ where: { localID: localID } });
    if (project) {
      await project.update({ serverID: serverID });
    }
  }

  async updateTimeEntryServerID(localID: number, serverID: number) {
    const entry = await this.TimeEntry.findOne({ where: { localID: localID } });
    if (entry) {
      await entry.update({ serverID: serverID });
    }
  }

  async fetchUpdatesFromServer(lastMerged: Date) {
    let timestamp = lastMerged.toISOString()
    try {
      let response = await this.stApiInstance.get('/fetch-updates', {
        'last-merged': timestamp,
      });

      if (!response.projects || !response.timeEntries) {
        console.error('Error fetching updates:', response.data);
        return;
      }

      // Extract the projects and time entries from the server response
      const { projects, timeEntries } = response;

      // Check if there are any updates to merge
      if (projects.length === 0 && timeEntries.length === 0) {
        console.log('No updates to merge.');
        return;
      }


      // Update local projects database
      if (projects.length > 0) {
        for (const project of projects) {
          await this.mergeProjectWithLocalDB(project);
        }
      }

      // Update local time entries database
      if (timeEntries.length > 0) {
        for (const entry of timeEntries) {
          await this.mergeTimeEntryWithLocalDB(entry);
        }
      }

      // Update the lastMerged timestamp in your local storage
      // Assuming you have a method like this
      await this.updateLastMergedTimestamp(new Date());

      console.log('Updates fetched and merged successfully.');
    } catch (error) {
      console.error('Error while fetching updates: ', error);
    }
  }

  private async mergeProjectWithLocalDB(project: any) {
    try {
      // Use 'serverID' from the server as 'serverID' in the local database
      const existingProject = await this.Project.findOne({
        where: { serverID: project.serverID },
      });

      if (existingProject) {
        // Update the existing project
        await existingProject.update({
          serverID: project.serverID,
          name: project.name,
          description: project.description,
          updated_at: new Date()
        });
      } else {
        // Create a new project with the serverID
        await this.Project.create({
          serverID: project.serverID,
          name: project.name,
          description: project.description,
        });
      }

      console.log(`Project '${project.name}' merged successfully.`);
    } catch (error) {
      console.error(`Error merging project '${project.name}':`, error);
    }
  }

  private async mergeTimeEntryWithLocalDB(entry: any) {

    try {
      // Find the local project ID based on the serverProjectID (which is the serverID of the project)
      const project = await this.Project.findOne({ where: { serverID: entry.serverProjectID } });
      const projectLocalID = project.localID

      // Handle the time entry
      const existingEntry = await this.TimeEntry.findOne({ where: { serverID: entry.serverID } });


      if (existingEntry) {
        // Update the existing entry with the new data and the local project ID
        await existingEntry.update({
          serverID: entry.serverID,
          projectID: projectLocalID,
          serverProjectID: entry.serverProjectID,
          startTime: entry.startTime,
          endTime: entry.endTime,
          description: entry.description,
          updated_at: new Date(),
        });
      } else {
        // Create a new time entry with the serverID, local project ID, and server project ID
        await this.TimeEntry.create({
          serverID: entry.serverID,
          projectID: projectLocalID,
          serverProjectID: entry.serverProjectID,
          startTime: entry.startTime,
          endTime: entry.endTime,
          description: entry.description,
        });
      }

      console.log(`Time Entry merged successfully.`);
    } catch (error) {
      console.error(`Error merging time entry:`, error);
    }
  }

  private async updateLastMergedTimestamp(timestamp: Date) {
    try {
      this.LastMerged = timestamp;
      const filePath = path.join(app.getPath('userData'), 'last-merged.txt');
      await fs.writeFile(filePath, timestamp.toISOString());
      console.log('Last merged timestamp updated successfully.');
    } catch (error) {
      console.error('Error updating last merged timestamp:', error);
    }
  }

  private async updateLastPushedTimestamp(timestamp: Date) {
    console.log('updateLastPushedTimestamp', timestamp)
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
