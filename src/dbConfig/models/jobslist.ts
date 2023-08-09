import mongoose, { Schema, model } from "mongoose";
import IJob from "../interface/joblist.interface";

const jobsSchema = new Schema<IJob>({
  jobId : {
    type: String,
    required: true,
  },
  pipelineName : {
    type: String,
    required: true,
  },
  pipelineUrl: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  updatedBy: {
    type: String,
    required: true,
  },
  updatedTime: {
    type: Date,
    required: true,
    default: Date.now()
  }
});

const jobs = model<IJob>("jobs", jobsSchema);

export default jobs;
