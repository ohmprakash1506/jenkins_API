import { Request, Response } from "express";
import axios, { AxiosResponse } from "axios";
import "dotenv/config";

require("dotenv").config();
const jenkinsUrl = process.env.JENKINS_URL;
const username: any = process.env.JENKINS_USER;
const password: any = process.env.JENKINS_PASS;

export default class jenkins {
  allJobs = async (req: Request, res: Response) => {
    try {
      const jenkinsJobAPI = `${jenkinsUrl}api/json?pretty=true`;
      const response: AxiosResponse = await axios.get(jenkinsJobAPI, {
        auth: {
          username,
          password,
        },
      });

      console.log(response.data.jobs);
      res.status(200).json(response.data.jobs);
    } catch (error: any) {
      console.error(`Status:`, error.response.status);
      console.error(`Data:`, error.response.data);
      console.error(`Data_response:`, error.response.config.data);
      res.status(500).json({ error: `Error..! failed to fetch jenkins data` });
    }
  };

  createJob = async (req: Request, res: Response) => {
    try {
    } catch (error) {}
  };

  getJob = async (req: Request, res: Response) => {
    try {
    } catch (error) {}
  };

  updateJob = async (req: Request, res: Response) => {
    try {
    } catch (error) {}
  };

  deleteJob = async (req: Request, res: Response) => {
    try {
    } catch (error) {}
  };
}
