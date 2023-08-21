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
</project>`;

const pipeLineXML = `<?xml version='1.0' encoding='UTF-8'?>
<flow-definition plugin="workflow-job@2.40">
  <actions/>
  <description>My Basic Pipeline</description>
  <keepDependencies>false</keepDependencies>
  <properties/>
  <definition class="org.jenkinsci.plugins.workflow.cps.CpsFlowDefinition" plugin="workflow-cps@2.97">
    <script>pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout ([$class: 'GitSCM', branches: [[name : 'main']],userRemoteConfigs: [[url: 'https://github.com/ohmprakash1506/jenkines_node.git']]])
            }
        }

        stage('Build') {
            steps {
                echo "build completed..."
            }
        }

        stage('Test') {
            steps {
                echo "Test completed..."
            }
        }

        stage('Deploy') {
            steps {
                echo "deployed the code..."
            }
        }

        stage('SonarQube Analysis') {
          environment {
            scannerHome = tool name: 'SonnarCubeScanner', type: 'hudson.plugins.sonar.SonarRunnerInstallation'
          }
          steps {
            script {
              withSonarQubeEnv('SonnarQube') {
                // sh "https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-3.3.0.1492-linux.zip"
                sh "curl -o sonar-scanner.zip -L https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-5.0.1.3006-linux.zip"
                echo "sonnar qube"
              }
            }
          }
         
        }
    }

    post {
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}</script>
    <sandbox>true</sandbox>
  </definition>
  <triggers/>
  <disabled>false</disabled>
</flow-definition>
`;

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
</multibranch-project>`;

const sonarQube = `<?xml version='1.1' encoding='UTF-8'?>
<flow-definition plugin="workflow-job@2.40">
  <actions/>
  <description>Dynamic Git and SonarQube Pipeline</description>
  <keepDependencies>false</keepDependencies>
  <properties/>
  <definition class="org.jenkinsci.plugins.workflow.cps.CpsScmFlowDefinition" plugin="workflow-cps@2.90">
    <scm class="hudson.plugins.git.GitSCM" plugin="git@4.12.0">
      <configVersion>2</configVersion>
      <userRemoteConfigs>
        <hudson.plugins.git.UserRemoteConfig>
          <url>https://gitlab.com/vm1999/gitlab-first</url>
        </hudson.plugins.git.UserRemoteConfig>
      </userRemoteConfigs>
      <branches>
        <hudson.plugins.git.BranchSpec>
          <name>*/main</name>
        </hudson.plugins.git.BranchSpec>
      </branches>
      <doGenerateSubmoduleConfigurations>false</doGenerateSubmoduleConfigurations>
      <submoduleCfg class="list"/>
      <extensions/>
    </scm>
    <script>pipeline {
      agent any
  
      stages {
          stage('Checkout') {
              steps {
                  script {
                      // Checkout the code from Git
                      git url: 'https://gitlab.com/vm1999/gitlab-first', branch: 'main'
                      echo 'checkout completed'
                  }
              }
          }

          stage('Test'){
            echo 'Testing..'
          }
          
          stage('Build') {
              steps {
                  script {
                      // Build your application
                      echo 'build..'
                  }
              }
          }
          
          stage('SonarQube Analysis') {
              steps {
                  script {
                      withSonarQubeEnv('SonnarQube') {
                          // Run SonarQube analysis
                          sh 'sonar-scanner'
                      }
                  }
              }
          }
      }
  }
  </script>
  </definition>
  <triggers/>
  <disabled>false</disabled>
</flow-definition>
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
      const statusCode = HttpStatusCodes.OK;
      const data = response.data.jobs;
      res
        .status(statusCode)
        .json(returnSuccess(statusCode, successmessage, data));
    } catch (error: any) {
      console.error(error.response);
      const errorMessage = `Error..! failed to fetch jenkins data`;
      const statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR;
      res.status(statusCode).json(returnError(statusCode, errorMessage));
    }
  };

  createJob = async (req: Request, res: Response) => {
    try {
      const jobName = req.body.jobName;
      const xmlJobFile = req.body.xmlJobFile;

      let jobConfig;
      let configErrorMessage;

      if (xmlJobFile === `freestylejob`) {
        jobConfig = FreeStyleXML;
      } else if (xmlJobFile === `pipelinejob`) {
        jobConfig = pipeLineXML;
      } else if (xmlJobFile === `multiplipelinejob`) {
        jobConfig = multiPipeLineXML;
      } else if (xmlJobFile === `sonarqube`) {
        jobConfig = sonarQube;
      } else {
        configErrorMessage = `jobconfig deatils not mentioned`;
      }

      console.log(`jobConfig:`, jobConfig);

      if (!jobConfig) {
        console.log(`Error:`, configErrorMessage);
        const statusCode = HttpStatusCodes.BAD_REQUEST;
        const message: any = configErrorMessage;
        res.status(statusCode).json(returnError(statusCode, message));
      } else {
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
        const statusCode = HttpStatusCodes.OK;
        res.status(statusCode).json(returnSuccess(statusCode, message));
      }
    } catch (error: any) {
      console.log(error);
      const errorMessage = `Error while creating job`;
      const statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR;
      res.status(statusCode).json(returnError(statusCode, errorMessage));
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
