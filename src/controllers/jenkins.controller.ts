import { Request, Response } from "express";
import axios, { AxiosResponse } from "axios";
import fs from "fs";
import "dotenv/config";

require("dotenv").config();
const jenkinsUrl = process.env.JENKINS_URL;
const username: any = process.env.JENKINS_USER;
const password: any = process.env.JENKINS_PASS;
const header = {
  "Content-Type": "application/json",
};

export default class jenkins {
  allJobs = async (req: Request, res: Response) => {
    const jenkinsJobAPI = `${jenkinsUrl}api/json?pretty=true`;
    console.log(`Jenkins URL:`, jenkinsJobAPI);
    try {
      const response: AxiosResponse = await axios.get(jenkinsJobAPI, {
        auth: {
          username,
          password,
        },
      });

      console.log(response.data.jobs);
      res.status(200).json(response.data.jobs);
    } catch (error: any) {
      console.error(error.response);
      console.error(`Status:`, error.response.status);
      console.error(`Data:`, error.response.data);
      console.error(`Data_response:`, error.response.config.data);
      res.status(500).json({ error: `Error..! failed to fetch jenkins data` });
    }
  };

  createJob = async (req: Request, res: Response) => {
    try {
      const jobName = req.body.jobName;
      const createJobUrl = `${jenkinsUrl}createItem?name=${jobName}`;
      const filePath =
        "D:\\code\\Jenkins\\jenkins-api\\src\\confilgFile\\createConfig.json";
      let readData;
      fs.readFile(filePath, "utf-8", async (error, data) => {
        if (error) {
          console.error(`Error reading the file :`, error);
        }
        console.log(`readFileData :`, data);
        readData = JSON.parse(data);

        const jobCongifJson = readData;
        console.log(`Job: `, jobCongifJson);

        const response = await axios.post(createJobUrl, jobCongifJson, {
          auth: {
            username,
            password,
          },
          headers: header,
        });

        console.log(`JOB : ${jobName} created successfully..!`);
        console.log(`RESPONSE :`, response.data);
        res.status(200).json({ message: `Job Created successfully` });
      });

      
    } catch (error) {
      // console.error(`Error Created:`, error);
      res.status(500).json({ error: `Error creating the job` });
    }
  };

  getJob = async (req: Request, res: Response) => {
    try {
    } catch (error) {}
  };

  deleteJob = async (req: Request, res: Response) => {
    try {
    } catch (error) {}
  };
}
