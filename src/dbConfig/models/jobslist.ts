import mongoose, { Schema, model } from "mongoose";
import IJob from "../interface/joblist.interface";

const jobsSchema = new Schema<IJob>(
  {
    jobId: {
      type: String,
      required: true,
    },
    jobName: {
      type: String,
      required: true,
    },
    jobUrl: {
      type: String,
      required: true,
    },
    jobType: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "Active",
    },
    createdBy: {
      type: String,
      required: true,
    },
    updatedBy: {
      type: String,
      required: true,
    },
    createdTime: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    updatedTime: {
      type: Date,
      required: true,
      default: Date.now(),
    },
  },
  {
    timestamps: false,
  }
);

const jobs = model<IJob>("jobs", jobsSchema);

export default jobs;
