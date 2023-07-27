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
      const jenkinsJobAPI = `${jenkinsUrl}api/`;
      const response: AxiosResponse = await axios.get(jenkinsJobAPI, {
        auth: {
          username,
          password,
        },
      });
      console.log(response);
      res.status(200).json(response.data.jobs);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: `Error..! failed to fetch jenkins data` });
    }
  };
}
