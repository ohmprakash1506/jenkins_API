import { Request, Response } from "express";
import axios, { AxiosResponse } from "axios";
import fs from "fs";
import "dotenv/config";
import CSRFToken from '../tokenGenerator/CSRF_Token';

require("dotenv").config();
const jenkinsUrl = process.env.JENKINS_URL;
const username: any = process.env.JENKINS_USER;
const password: any = process.env.JENKINS_PASS;

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
`

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
      const jobName = 'new Job'
      const jobConfig = xmlJob
      const createJobUrl = `${jenkinsUrl}createItem?name=${jobName}`;

      const { csrfCrumb, csrfHeader } = await CSRFToken(jenkinsUrl, username, password);

      const response = await axios.post(createJobUrl, jobConfig, {
        auth: {
          username,
          password
        },
        headers: {
          [csrfHeader]: csrfCrumb,
          'Content-Type': 'application/xml'
        }
      })

      console.log(`Job created successfully`);

      res.status(200).json({message: `Job created successfully`});

    } catch (error : any) {
      console.log(error);
      res.status(500).json({error: `Error creating job`})
    }
  }

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
