export type Project = {
    id: number;
    name: string;
    color: string;
    totalTime: {
      hours: number;
      minutes: number;
      seconds: number;
    };
  };
