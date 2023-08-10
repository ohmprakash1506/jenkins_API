import { Request, Response } from "express";
import axios, { AxiosResponse } from "axios";
import fs from "fs";
import "dotenv/config";
import CSRFToken from '../tokenGenerator/CSRF_Token';

require("dotenv").config();
const jenkinsUrl = process.env.JENKINS_URL;
const username: any = process.env.JENKINS_USER;
const password: any = process.env.JENKINS_PASS;

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

  // CSRF_token = async (req: Request, res: Response) => {
  //   try {
  //     const getCSRFTokenUrl = `${jenkinsUrl}crumbIssuer/api/json?pretty=true`;
  //     const tokenResponse = await axios.get(getCSRFTokenUrl, {
  //       auth: {
  //         username,
  //         password,
  //       },
  //     });
  //     const date = new Date().toISOString()
  //     const csrfCrumb = tokenResponse.data.crumb;
  //     console.log(csrfCrumb);
  //     const csrfHeader = tokenResponse.data.crumbRequestField;
  //     console.log(csrfHeader);
  //     res.status(200).json({message :`CSFR CODE : ${csrfCrumb}, at : ${date}` })
  //   } catch (error: any) {
  //     console.error(error.response);
  //   }
  // };

  createJob = async (req: Request, res: Response) => {
    try {
      const jobName = req.body.jobName;
      const createJobUrl = `${jenkinsUrl}createItem?name=${jobName}`;
      const filePath =
        "/Users/ohmprakash/Desktop/programming/jenkins_API/jenkins_API/src/confilgFile/createConfig.json";
      let readData;
      fs.readFile(filePath, "utf-8", async (error, data) => {
        if (error) {
          console.error(`Error reading the file :`, error);
        }
        console.log(`readFileData :`, data);
        readData = JSON.parse(data);

        const jobCongifJson = readData;
        console.log(`Job: `, jobCongifJson);
        const header = {
          "Content-Type": "application/json",
        };

        const response = await axios.post(createJobUrl, jobCongifJson, {
          auth: {
            username,
            password,
          },
          // headers: {
          //   "Content-Type": "application/json",
          // },
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

  buildTrigger = async (req: Request, res: Response) => {
    try {
      const jobName = req.body.jobName;
      const buildUrl = `${jenkinsUrl}job/${jobName}/build`;

      const CSRF_Token = await CSRFToken(jenkinsUrl, username, password)
      const header: any = {
        'Jenkins-Crumb' : CSRFToken,
        'Content-Type' : 'application/json'
      };

      const response = await axios.post(
        buildUrl,
        {},
        {
          auth: {
            username,
            password,
          },
          headers: {
            header,
          },
        }
      );

      console.log(`Job tiggered succesfully`);
      res.status(200).json({ message: `Job tiggered succesfully` });
    } catch (error: any) {
      console.log(`Error while building the code`);
      console.log(error);
      res.status(500).json({ error: `Error while building the job` });
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
