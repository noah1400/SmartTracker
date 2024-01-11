export type ProjectData = {
  localID: number;
  name: string;
  description: string;
};


export type Project = {
    dataValues: ProjectData; 
  };


export type TimeEntryData = {
  localID: number;
  startTime: Date;
  endTime: Date;
  createdAt: Date;
  updatedAt: Date;
  projectID: number;
  serverProjectID: number;
}; 

export type TimeEntry = {
  dataValues: TimeEntryData;
};
