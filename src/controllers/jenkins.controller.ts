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

const FreeStyleXML = `<project>
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
</project>` 

const pipeLineXML = `<flow-definition plugin="workflow-job@2.40">
<actions/>
<description>My Pipeline Project</description>
<keepDependencies>false</keepDependencies>
<properties/>
<definition class="org.jenkinsci.plugins.workflow.cps.CpsFlowDefinition" plugin="workflow-cps@2.85">
  <script>pipeline {
  agent any
  stages {
      stage('Build') {
          steps {
              echo 'Building...'
          }
      }
      stage('Test') {
          steps {
              echo 'Testing...'
          }
      }
      stage('Deploy') {
          steps {
              echo 'Deploying...'
          }
      }
  }
}</script>
  <sandbox>true</sandbox>
</definition>
<triggers/>
<disabled>false</disabled>
</flow-definition>`

const multiPipeLineXML = `<multibranch-project>
<actions/>
<description>My Multibranch Pipeline Project</description>
<displayName>My Multibranch Pipeline Project</displayName>
<properties/>
<sources class="jenkins.branch.MultiBranchProject$BranchSourceList" plugin="branch-api@2.9.0">
  <data>
    <jenkins.branch.BranchSource>
      <source class="jenkins.plugins.git.GitSCMSource" plugin="git@4.10.0">
        <remote>https://github.com/yourusername/yourrepository.git</remote>
        <credentialsId>your-git-credentials-id</credentialsId>
        <traits>
          <jenkins.plugins.git.traits.BranchDiscoveryTrait/>
          <jenkins.plugins.git.traits.TagDiscoveryTrait/>
          <jenkins.plugins.git.traits.ForkPullRequestDiscoveryTrait>
            <strategyId>1</strategyId>
          </jenkins.plugins.git.traits.ForkPullRequestDiscoveryTrait>
        </traits>
      </source>
      <strategy class="jenkins.branch.DefaultBranchPropertyStrategy">
        <properties class="empty-list"/>
      </strategy>
    </jenkins.branch.BranchSource>
  </data>
</sources>
<configureBlocks/>
</multibranch-project>`

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
      const xmlJobFile = req.body.xmlJobFile;

      let jobConfig;

      if (xmlJobFile === `freestylejob` ) {
        jobConfig = FreeStyleXML ;
      } else if ( xmlJobFile === `pipelinejob` ){
        jobConfig = pipeLineXML;
      } else if ( xmlJobFile === `multiplipelinejob`){
        jobConfig = multiPipeLineXML;
      } else {
        res.send(`jobconfig deatils not mentioned`);
      }

      console.log(`jobConfig:`,jobConfig);

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
