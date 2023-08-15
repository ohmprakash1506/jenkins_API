import { Request, Response } from "express";
import axios, { AxiosResponse } from "axios";
import fs from "fs";
import "dotenv/config";
import CSRFToken from "../services/CSRF_Token";
import { returnError, returnSuccess } from "../middlewares/ApiResponseHandlers";
import HttpStatusCodes from "http-status-codes";

require("dotenv").config();
const jenkinsUrl = process.env.JENKINS_URL;
const username: any = process.env.JENKINS_USER;
const password: any = process.env.JENKINS_API_TOKEN;

const xmlJob = `<project>
<actions/>
<description>My Freestyle Project</description>
<keepDependencies>false</keepDependencies>
<properties/>
<scm class="hudson.scm.NullSCM"/>
<canRoam>true</canRoam>
<disabled>false</disabled>
<blockBuildWhenDownstreamBuilding>false</blockBuildWhenDownstreamBuilding>
<blockBuildWhenUpstreamBuilding>false</blockBuildWhenUpstreamBuilding>
<triggers/>
<concurrentBuild>false</concurrentBuild>
<builders>
  <hudson.tasks.Shell>
    <command>echo "Hello, Jenkins!"</command>
  </hudson.tasks.Shell>
</builders>
<publishers/>
<buildWrappers/>
</project>
`;

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
      const successmessage = `Jobs listed successfully`;
      const statusCode = HttpStatusCodes.OK
      const data = response.data.jobs;
      res
        .status(statusCode)
        .json(returnSuccess(statusCode, successmessage, data));
    } catch (error: any) {
      console.error(error.response);
      const errorMessage = `Error..! failed to fetch jenkins data`;
      const statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR
      res
        .status(statusCode)
        .json(returnError(statusCode, errorMessage));
    }
  };

  createJob = async (req: Request, res: Response) => {
    try {
      const jobName = req.body.jobName;
      const jobConfig = xmlJob;
      const createJobUrl = `${jenkinsUrl}createItem?name=${jobName}`;

      const { csrfCrumb, csrfHeader } = await CSRFToken(
        jenkinsUrl,
        username,
        password
      );

      const response = await axios.post(createJobUrl, jobConfig, {
        auth: {
          username,
          password,
        },
        headers: {
          [csrfHeader]: csrfCrumb,
          "Content-Type": "application/xml",
        },
      });
      console.log(`Response:`, response);
      console.log(`Job created successfully`);
      const message = `Job created successfully`;
      const statusCode = HttpStatusCodes.OK
      res
        .status(statusCode)
        .json(returnSuccess(statusCode, message));
    } catch (error: any) {
      console.log(error);
      const errorMessage = `Error while creating job`;
      const statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR
      res
        .status(statusCode)
        .json(returnError(statusCode, errorMessage));
    }
  };

  buildTrigger = async (req: Request, res: Response) => {
    try {
      const jobName = req.body.jobName;
      const buildUrl = `${jenkinsUrl}job/${jobName}/build`;

      const CSRF_Token = await CSRFToken(jenkinsUrl, username, password);
      const header: any = {
        "Jenkins-Crumb": CSRFToken,
        "Content-Type": "application/json",
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
      const statusCode = HttpStatusCodes.OK;
      const message = `Job tiggered succesfully`;
      res.status(statusCode).json(returnSuccess(statusCode, message));
    } catch (error: any) {
      console.log(`Error while building the code`);
      console.log(error);
      const errorMessage = `Error while building the job`;
      const statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR;
      res.status(statusCode).json(returnError(statusCode, errorMessage));
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
