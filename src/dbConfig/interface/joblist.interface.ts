import { Document } from "mongodb";

interface IJob extends Document {
    jobId: string;
    jobName: string;
    jobUrl: string;
    jobType: string;
    status: string;
    createdBy: string;
    updatedBy: string;
    createdTime: Date;
    updateTime: Date;
  }

export default IJob;