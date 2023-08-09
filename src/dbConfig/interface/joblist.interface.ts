import { Document } from "mongodb";

interface IJob extends Document {
    jobId: string;
    pipelineName: string;
    pipelineUrl: string;
    status: string;
    updatedBy: string;
    updateTime: Date;
  }

export default IJob;