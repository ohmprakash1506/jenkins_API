import mongoose, { Schema, model } from "mongoose";

const jobsSchema: Schema = new Schema({
  jobId: {
    type: String,
    required: true,
  },
  pipelineName: {
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
    type: String,
    required: true,
  },
});

const jobs = model("jobs", jobsSchema);

export default jobs;
